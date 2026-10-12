"""
Video → pixel art dönüştürücü.

Çıktı formatı (bir iş klasöründe):
    meta.json     {width, height, fps, frame_count, palette: [[r,g,b], ...], ...}
    frames.bin    frame_count × height × width adet uint8 palet indeksi (satır sıralı)
    frames.bin.gz aynı verinin gzip'li hali (sunucu bunu Content-Encoding: gzip ile verir)

İşleyiş iki geçişlidir ve bellek kullanımı videonun uzunluğundan bağımsızdır:
    1. Geçiş: frame'ler zaman tabanlı örneklenir, grid boyutuna küçültülür (INTER_AREA),
       renk ayarları uygulanır ve ham RGB olarak geçici dosyaya yazılır.
    2. Geçiş: örnek frame'lerden tek bir global palet çıkarılır (frame'ler arası renk
       titremesi olmaz), 32×32×32'lik bir renk tablosu (LUT) ile her piksel palete eşlenir.
"""

import gzip
import json
import math
import os
import shutil
from dataclasses import dataclass, asdict, field

import cv2
import numpy as np


class ConversionError(Exception):
    """Kullanıcıya gösterilebilecek dönüştürme hatası."""


class ConversionCancelled(Exception):
    pass


# Hazır paletler (RGB). 'auto' videodan çıkarılır.
PRESET_PALETTES = {
    'gameboy': ['0f380f', '306230', '8bac0f', '9bbc0f'],
    'pico8': ['000000', '1d2b53', '7e2553', '008751', 'ab5236', '5f574f', 'c2c3c7', 'fff1e8',
              'ff004d', 'ffa300', 'ffec27', '00e436', '29adff', '83769c', 'ff77a8', 'ffccaa'],
    'sweetie16': ['1a1c2c', '5d275d', 'b13e53', 'ef7d57', 'ffcd75', 'a7f070', '38b764', '257179',
                  '29366f', '3b5dc9', '41a6f6', '73eff7', 'f4f4f4', '94b0c2', '566c86', '333c57'],
    'cga': ['000000', '55ffff', 'ff55ff', 'ffffff'],
    'pastel': ['fbf8cc', 'fde4cf', 'ffcfd2', 'f1c0e8', 'cfbaf0', 'a3c4f3', '90dbf4', '8eecf5',
               '98f5e1', 'b9fbc0', 'ffffff', '6d6875'],
    'grayscale': None,  # aşağıda üretilir
    'sepia': None,
}

PALETTE_LABELS = {
    'auto': 'Otomatik (videodan)',
    'gameboy': 'Game Boy (4 renk)',
    'pico8': 'PICO-8 (16 renk)',
    'sweetie16': 'Sweetie 16',
    'cga': 'CGA (4 renk)',
    'pastel': 'Pastel (12 renk)',
    'grayscale': 'Gri tonlama (8)',
    'sepia': 'Sepya (8)',
}


def _hex_to_rgb(h):
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


def preset_palette(name):
    if name == 'grayscale':
        return [[v, v, v] for v in np.linspace(0, 255, 8).astype(int).tolist()]
    if name == 'sepia':
        a, b = np.array([43, 29, 14]), np.array([244, 227, 195])
        return [(a + (b - a) * t).astype(int).tolist() for t in np.linspace(0, 1, 8)]
    if name in PRESET_PALETTES:
        return [_hex_to_rgb(h) for h in PRESET_PALETTES[name]]
    raise ConversionError(f'Bilinmeyen palet: {name}')


@dataclass
class ConversionParams:
    pixel_size: int = 8          # bir grid hücresine düşen kaynak piksel sayısı
    fps: float = 10.0            # hedef fps; 0 = kaynak fps
    max_frames: int = 0          # 0 = sınırsız (yine de MAX_FRAMES uygulanır)
    start: float = 0.0           # saniye
    end: float = 0.0             # saniye; 0 = video sonu
    palette: str = 'auto'
    colors: int = 16             # 'auto' palet için renk sayısı
    dither: str = 'none'         # none | bayer4 | bayer8
    brightness: int = 0          # -100..100
    contrast: int = 0            # -100..100
    saturation: int = 100        # 0..200 (%)

    # Sunucu sınırları
    MAX_GRID_WIDTH = 320
    MAX_GRID_HEIGHT = 320
    MAX_FRAMES = 3000

    @classmethod
    def from_form(cls, form):
        """Form verisinden doğrulanmış parametre üret. Hatalıysa ConversionError."""
        def num(name, cast, default, lo, hi):
            raw = form.get(name, '')
            if raw is None or str(raw).strip() == '':
                return default
            try:
                value = cast(float(raw)) if cast is int else cast(raw)
            except (TypeError, ValueError):
                raise ConversionError(f'Geçersiz değer: {name}={raw!r}')
            if not math.isfinite(value) or value < lo or value > hi:
                raise ConversionError(f'{name} {lo}–{hi} aralığında olmalı (gelen: {raw})')
            return value

        p = cls(
            pixel_size=num('pixel_size', int, 8, 2, 64),
            fps=num('fps', float, 10.0, 0, 60),
            max_frames=num('max_frames', int, 0, 0, cls.MAX_FRAMES),
            start=num('start', float, 0.0, 0, 24 * 3600),
            end=num('end', float, 0.0, 0, 24 * 3600),
            colors=num('colors', int, 16, 2, 64),
            brightness=num('brightness', int, 0, -100, 100),
            contrast=num('contrast', int, 0, -100, 100),
            saturation=num('saturation', int, 100, 0, 200),
            palette=str(form.get('palette') or 'auto'),
            dither=str(form.get('dither') or 'none'),
        )
        if p.palette != 'auto' and p.palette not in PRESET_PALETTES:
            raise ConversionError(f'Bilinmeyen palet: {p.palette}')
        if p.dither not in ('none', 'bayer4', 'bayer8'):
            raise ConversionError(f'Bilinmeyen dithering: {p.dither}')
        if p.end and p.end <= p.start:
            raise ConversionError('Bitiş zamanı başlangıçtan büyük olmalı')
        return p


@dataclass
class VideoInfo:
    width: int
    height: int
    fps: float
    frame_count: int
    duration: float


def probe(path):
    """Videoyu açıp temel bilgileri döndür. Açılamazsa ConversionError."""
    cap = cv2.VideoCapture(path)
    try:
        if not cap.isOpened():
            raise ConversionError('Video açılamadı (dosya bozuk veya desteklenmeyen format)')
        ok, frame = cap.read()
        if not ok or frame is None:
            raise ConversionError('Videodan hiç frame okunamadı (dosya bozuk olabilir)')
        h, w = frame.shape[:2]
        fps = cap.get(cv2.CAP_PROP_FPS) or 0
        if not math.isfinite(fps) or fps <= 0 or fps > 1000:
            fps = 25.0
        count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        duration = count / fps if count > 0 else 0.0
        return VideoInfo(width=w, height=h, fps=float(fps), frame_count=max(count, 0), duration=duration)
    finally:
        cap.release()


def grid_size(width, height, pixel_size):
    """Grid boyutu; çok büyükse pixel_size otomatik büyütülür. (gw, gh, efektif pixel_size)"""
    ps = pixel_size
    while True:
        gw, gh = max(1, width // ps), max(1, height // ps)
        if gw <= ConversionParams.MAX_GRID_WIDTH and gh <= ConversionParams.MAX_GRID_HEIGHT:
            return gw, gh, ps
        ps += 1


def adjust_colors(rgb, brightness, contrast, saturation):
    """uint8 RGB üzerinde parlaklık / kontrast / doygunluk."""
    if brightness == 0 and contrast == 0 and saturation == 100:
        return rgb
    f = rgb.astype(np.float32)
    if saturation != 100:
        gray = f @ np.array([0.299, 0.587, 0.114], np.float32)
        f = gray[..., None] + (f - gray[..., None]) * (saturation / 100.0)
    if contrast:
        f = (f - 128.0) * (1.0 + contrast / 100.0) + 128.0
    if brightness:
        f = f + brightness * 1.28
    return np.clip(f, 0, 255).astype(np.uint8)


def extract_palette(samples_rgb, colors):
    """Örnek piksellerden k-means++ ile global palet."""
    data = samples_rgb.reshape(-1, 3).astype(np.float32)
    unique = np.unique(samples_rgb.reshape(-1, 3), axis=0)
    k = int(min(colors, len(unique)))
    if k <= 1:
        return unique[:1].astype(int).tolist() or [[0, 0, 0]]
    if len(data) > 60000:
        rng = np.random.default_rng(0)
        data = data[rng.choice(len(data), 60000, replace=False)]
    cv2.setRNGSeed(0)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5)
    _, _, centers = cv2.kmeans(data, k, None, criteria, 3, cv2.KMEANS_PP_CENTERS)
    centers = np.clip(np.rint(centers), 0, 255).astype(int)
    # Parlaklığa göre sırala (koyudan açığa) — ASCII modu ve tutarlılık için faydalı
    order = np.argsort(centers @ np.array([299, 587, 114]))
    return centers[order].tolist()


def build_lut(palette):
    """5 bit/kanal (32³) renk → palet indeksi tablosu, algısal ağırlıklı mesafe."""
    pal = np.asarray(palette, np.float32)
    levels = (np.arange(32, dtype=np.float32) * 8 + 4)
    r, g, b = np.meshgrid(levels, levels, levels, indexing='ij')
    grid = np.stack([r, g, b], -1).reshape(-1, 1, 3)
    weights = np.array([2.0, 4.0, 3.0], np.float32)
    best = np.zeros(grid.shape[0], np.uint8)
    best_d = np.full(grid.shape[0], np.inf, np.float32)
    for i, c in enumerate(pal):
        d = (((grid[:, 0, :] - c) ** 2) * weights).sum(1)
        mask = d < best_d
        best[mask] = i
        best_d[mask] = d[mask]
    return best


_BAYER4 = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], np.float32) / 16.0 - 0.5


def _bayer(n):
    if n == 4:
        return _BAYER4
    m = np.array([[0, 2], [3, 1]], np.float32)
    while m.shape[0] < n:
        m = np.block([[4 * m, 4 * m + 2], [4 * m + 3, 4 * m + 1]])
    return m / (n * n) - 0.5


def map_to_palette(rgb, lut, dither='none', strength=48.0):
    """uint8 RGB (h,w,3) → uint8 palet indeksi (h,w)."""
    if dither in ('bayer4', 'bayer8'):
        n = 4 if dither == 'bayer4' else 8
        m = _bayer(n)
        h, w = rgb.shape[:2]
        tile = np.tile(m, (h // n + 1, w // n + 1))[:h, :w, None]
        rgb = np.clip(rgb.astype(np.float32) + tile * strength, 0, 255).astype(np.uint8)
    q = rgb >> 3
    key = (q[..., 0].astype(np.int32) << 10) | (q[..., 1].astype(np.int32) << 5) | q[..., 2]
    return lut[key]


@dataclass
class ConversionResult:
    width: int
    height: int
    fps: float
    frame_count: int
    palette: list
    pixel_size: int
    source: dict = field(default_factory=dict)
    params: dict = field(default_factory=dict)


def convert(video_path, out_dir, params, progress=None, cancelled=None):
    """
    Videoyu dönüştür ve out_dir'e meta.json + frames.bin(.gz) yaz.
    progress(oran 0..1, aşama_metni) ve cancelled() -> bool isteğe bağlı callback'lerdir.
    """
    progress = progress or (lambda *_: None)
    cancelled = cancelled or (lambda: False)
    info = probe(video_path)
    gw, gh, eff_ps = grid_size(info.width, info.height, params.pixel_size)

    src_fps = info.fps
    target_fps = src_fps if not params.fps or params.fps >= src_fps else params.fps
    step = 1.0 / target_fps
    start = params.start
    end = params.end or (info.duration if info.duration else float('inf'))
    if info.duration and start >= info.duration:
        raise ConversionError(f'Başlangıç ({start:g} sn) video süresinden ({info.duration:.1f} sn) büyük')
    max_frames = min(params.max_frames or ConversionParams.MAX_FRAMES, ConversionParams.MAX_FRAMES)
    expected = max(1, min(max_frames, int(((min(end, info.duration or end) - start) or 1) * target_fps) + 1))

    os.makedirs(out_dir, exist_ok=True)
    raw_path = os.path.join(out_dir, 'rgb.tmp')
    frame_bytes = gw * gh * 3
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ConversionError('Video açılamadı')
    count = 0
    try:
        if start > 0:
            cap.set(cv2.CAP_PROP_POS_MSEC, start * 1000.0)
        next_t = start
        index = int(round(cap.get(cv2.CAP_PROP_POS_FRAMES) or 0))
        with open(raw_path, 'wb') as raw:
            while count < max_frames:
                if cancelled():
                    raise ConversionCancelled()
                if not cap.grab():
                    break
                t = index / src_fps
                index += 1
                if t > end + 1e-6:
                    break
                if t + 1e-6 < next_t:
                    continue
                ok, frame = cap.retrieve()
                if not ok or frame is None:
                    continue
                next_t += step
                # Kaynak fps'den hızlı ilerleyen kayıtlarda boşluk biriktirmeyi önle
                if next_t < t:
                    next_t = t + step
                small = cv2.resize(frame, (gw, gh), interpolation=cv2.INTER_AREA)
                rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
                rgb = adjust_colors(rgb, params.brightness, params.contrast, params.saturation)
                raw.write(rgb.tobytes())
                count += 1
                if count % 5 == 0:
                    progress(min(0.8, 0.8 * count / expected), f'Frame okunuyor… {count}')
    finally:
        cap.release()

    try:
        if count == 0:
            raise ConversionError('Seçilen aralıkta hiç frame bulunamadı')
        frames = np.memmap(raw_path, np.uint8, 'r', shape=(count, gh, gw, 3))

        progress(0.82, 'Palet hesaplanıyor…')
        if params.palette == 'auto':
            pick = np.unique(np.linspace(0, count - 1, min(count, 24)).astype(int))
            palette = extract_palette(np.asarray(frames[pick]), params.colors)
        else:
            palette = preset_palette(params.palette)
        lut = build_lut(palette)

        bin_path = os.path.join(out_dir, 'frames.bin')
        with open(bin_path, 'wb') as out:
            for i in range(count):
                if cancelled():
                    raise ConversionCancelled()
                out.write(map_to_palette(np.asarray(frames[i]), lut, params.dither).tobytes())
                if i % 20 == 0:
                    progress(0.82 + 0.15 * i / count, f'Renkler eşleniyor… {i}/{count}')
        del frames

        progress(0.97, 'Sıkıştırılıyor…')
        with open(bin_path, 'rb') as src, gzip.open(bin_path + '.gz', 'wb', compresslevel=6) as dst:
            shutil.copyfileobj(src, dst, 1 << 20)
    finally:
        try:
            os.remove(raw_path)
        except OSError:
            pass

    result = ConversionResult(
        width=gw, height=gh, fps=round(target_fps, 4), frame_count=count, palette=palette,
        pixel_size=eff_ps,
        source={'width': info.width, 'height': info.height, 'fps': round(src_fps, 4),
                'duration': round(info.duration, 3)},
        params={k: v for k, v in asdict(params).items()},
    )
    with open(os.path.join(out_dir, 'meta.json'), 'w', encoding='utf-8') as f:
        json.dump(asdict(result), f, ensure_ascii=False)
    progress(1.0, 'Tamamlandı')
    return result
