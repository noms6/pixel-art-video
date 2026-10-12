// Dışa aktarma: video (WebM/MP4), GIF ve tek dosyalık HTML sayfası.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Hemen iptal edilirse bazı tarayıcılarda indirme başlamaz
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function checkAbort(signal) {
    if (signal && signal.aborted) throw new DOMException('İptal edildi', 'AbortError');
}

// ---------------------------------------------------------------- video

const VIDEO_TYPES = {
    mp4: ['video/mp4;codecs=avc1.42E01E', 'video/mp4;codecs=avc1', 'video/mp4'],
    webm: ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'],
};

export function supportedVideoFormat(format) {
    if (typeof MediaRecorder === 'undefined') return null;
    for (const fmt of [format, format === 'mp4' ? 'webm' : 'mp4']) {
        const mime = VIDEO_TYPES[fmt].find((t) => MediaRecorder.isTypeSupported(t));
        if (mime) return { format: fmt, mime };
    }
    return null;
}

// Frame'ler gerçek zamanlı ve mutlak zaman çizelgesine göre çizilir; böylece kaydın süresi
// orijinal videoyla aynı olur (çizim süresi gecikmeye eklenmez).
export async function recordVideo({ renderer, frameCount, fps, format, onProgress, signal }) {
    const chosen = supportedVideoFormat(format);
    if (!chosen) throw new Error('Bu tarayıcı video kaydını desteklemiyor');
    const canvas = renderer.canvas;
    const stream = canvas.captureStream(0);
    const track = stream.getVideoTracks()[0];
    const pixels = canvas.width * canvas.height;
    const recorder = new MediaRecorder(stream, {
        mimeType: chosen.mime,
        videoBitsPerSecond: Math.min(16e6, Math.max(2e6, pixels * fps * 0.15)),
    });
    const chunks = [];
    recorder.ondataavailable = (e) => e.data && e.data.size && chunks.push(e.data);
    const stopped = new Promise((resolve) => (recorder.onstop = resolve));
    recorder.start(1000);
    const frameMs = 1000 / fps;
    const t0 = performance.now();
    try {
        for (let i = 0; i < frameCount; i++) {
            checkAbort(signal);
            renderer.draw(i);
            if (track.requestFrame) track.requestFrame();
            if (onProgress) onProgress((i + 1) / frameCount);
            const wait = t0 + (i + 1) * frameMs - performance.now();
            await sleep(Math.max(0, wait));
        }
    } finally {
        recorder.stop();
        await stopped;
        track.stop();
    }
    checkAbort(signal);
    return { blob: new Blob(chunks, { type: chosen.mime.split(';')[0] }), ext: chosen.format };
}

// ---------------------------------------------------------------- GIF

function lzwEncode(indices, minCodeSize, out) {
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;
    let nextCode = eoiCode + 1;
    let codeSize = minCodeSize + 1;
    let table = new Map();
    let cur = 0;
    let curBits = 0;
    const block = [];

    const flushBlock = () => {
        if (!block.length) return;
        out.push(block.length, ...block);
        block.length = 0;
    };
    const emit = (code) => {
        cur |= code << curBits;
        curBits += codeSize;
        while (curBits >= 8) {
            block.push(cur & 0xff);
            if (block.length === 255) flushBlock();
            cur >>>= 8;
            curBits -= 8;
        }
    };

    out.push(minCodeSize);
    emit(clearCode);
    let prefix = indices[0];
    for (let i = 1; i < indices.length; i++) {
        const k = indices[i];
        const key = (prefix << 8) | k;
        const code = table.get(key);
        if (code !== undefined) {
            prefix = code;
            continue;
        }
        emit(prefix);
        if (nextCode === 4096) {
            emit(clearCode);
            table = new Map();
            nextCode = eoiCode + 1;
            codeSize = minCodeSize + 1;
        } else {
            if (nextCode >= 1 << codeSize) codeSize++;
            table.set(key, nextCode++);
        }
        prefix = k;
    }
    emit(prefix);
    emit(eoiCode);
    if (curBits > 0) {
        block.push(cur & 0xff);
        if (block.length === 255) flushBlock();
    }
    flushBlock();
    out.push(0);
}

export class GifEncoder {
    constructor(width, height, palette) {
        this.width = width;
        this.height = height;
        let bits = 1;
        while (1 << bits < Math.max(2, palette.length)) bits++;
        this.bits = bits;
        this.parts = [];
        const head = [];
        const str = (s) => { for (const ch of s) head.push(ch.charCodeAt(0)); };
        const u16 = (v) => head.push(v & 0xff, (v >> 8) & 0xff);
        str('GIF89a');
        u16(width);
        u16(height);
        head.push(0x80 | ((bits - 1) << 4) | (bits - 1), 0, 0);
        for (let i = 0; i < 1 << bits; i++) {
            const c = palette[i] || [0, 0, 0];
            head.push(c[0], c[1], c[2]);
        }
        // Sonsuz döngü (NETSCAPE2.0)
        head.push(0x21, 0xff, 0x0b);
        str('NETSCAPE2.0');
        head.push(0x03, 0x01, 0, 0, 0);
        this.parts.push(new Uint8Array(head));
    }

    addFrame(indices, delayCs) {
        const out = [0x21, 0xf9, 0x04, 0x00, delayCs & 0xff, (delayCs >> 8) & 0xff, 0, 0,
            0x2c, 0, 0, 0, 0, this.width & 0xff, this.width >> 8, this.height & 0xff, this.height >> 8, 0];
        lzwEncode(indices, Math.max(2, this.bits), out);
        this.parts.push(new Uint8Array(out));
    }

    finish() {
        this.parts.push(new Uint8Array([0x3b]));
        return new Blob(this.parts, { type: 'image/gif' });
    }
}

// 3-3-2 sabit palet (256 renk): şekil/ASCII modlarında karışık renkler için
const PALETTE_332 = Array.from({ length: 256 }, (_, i) => [
    Math.round(((i >> 5) & 7) * 255 / 7),
    Math.round(((i >> 2) & 7) * 255 / 7),
    Math.round((i & 3) * 255 / 3),
]);

export async function encodeGif({ renderer, frameCount, fps, onProgress, signal }) {
    const { canvas, video } = renderer;
    const w = canvas.width;
    const h = canvas.height;
    const pixelMode = renderer.style.mode === 'pixel';
    const palette = pixelMode ? video.palette : PALETTE_332;
    const gif = new GifEncoder(w, h, palette);
    const indices = new Uint8Array(w * h);
    const ctx = renderer.ctx;
    // Pixel modunda canvas çizmeden doğrudan grid'den ölçekle (birebir renk)
    const xMap = new Uint32Array(w).map((_, x) => Math.min(video.width - 1, Math.floor((x * video.width) / w)));
    for (let i = 0; i < frameCount; i++) {
        checkAbort(signal);
        if (pixelMode) {
            const data = video.frame(i);
            for (let y = 0; y < h; y++) {
                const row = Math.min(video.height - 1, Math.floor((y * video.height) / h)) * video.width;
                const o = y * w;
                for (let x = 0; x < w; x++) indices[o + x] = data[row + xMap[x]];
            }
        } else {
            renderer.draw(i);
            const px = ctx.getImageData(0, 0, w, h).data;
            for (let p = 0, q = 0; q < indices.length; p += 4, q++) {
                indices[q] = (px[p] & 0xe0) | ((px[p + 1] & 0xe0) >> 3) | (px[p + 2] >> 6);
            }
        }
        const delay = Math.round(((i + 1) * 100) / fps) - Math.round((i * 100) / fps);
        gif.addFrame(indices, Math.max(2, delay));
        if (onProgress) onProgress((i + 1) / frameCount);
        if (i % 3 === 0) await sleep(0);
    }
    return gif.finish();
}

// ---------------------------------------------------------------- tek dosyalık sayfa

async function gzip(bytes) {
    if (typeof CompressionStream === 'undefined') return null;
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
}

function toBase64(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
        s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(s);
}

// <script> içine güvenle gömülebilen JSON
const LINE_SEPARATORS = new RegExp(`[${String.fromCharCode(0x2028, 0x2029)}]`, 'g');

function safeJson(value) {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(LINE_SEPARATORS, (c) => `\\u${c.charCodeAt(0).toString(16)}`);
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export async function buildStandaloneHtml({ video, style, theme, message, typewriter, title }) {
    const raw = video.frames;
    const packed = await gzip(raw);
    const rendererSrc = (await (await fetch('/static/js/renderer.js')).text())
        .replace(/^export /gm, '')
        .replace(/<\/script/gi, '<\\/script');
    const payload = {
        meta: { width: video.width, height: video.height, fps: video.fps, frame_count: video.frameCount, palette: video.palette },
        style,
        message: message || '',
        typewriter: !!typewriter,
        gzip: !!packed,
        data: toBase64(packed || raw),
    };
    const safeTitle = escapeHtml(title || 'Sana özel 💕');
    return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${safeTitle}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Tahoma,Verdana,sans-serif;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:24px 16px;
background:linear-gradient(135deg,${theme.start} 0%,${theme.end} 100%);color:#fff}
.card{background:rgba(255,255,255,.2);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.35);border-radius:20px;padding:28px 32px;max-width:720px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.15)}
.msg{font-size:1.4rem;line-height:1.6;text-align:center;white-space:pre-wrap;text-shadow:1px 1px 3px rgba(0,0,0,.3);min-height:1.6em}
.msg.typing::after{content:'▍';animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.stage{width:100%;max-width:900px;background:rgba(0,0,0,.35);border-radius:18px;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,.3);cursor:pointer;position:relative}
canvas{display:block;margin:0 auto;max-width:100%;height:auto;image-rendering:pixelated;border-radius:8px}
.hint{text-align:center;font-size:.8rem;opacity:.75;margin-top:8px}
.loading{text-align:center;padding:40px;opacity:.85}
</style>
</head>
<body>
<div class="card"><div class="msg" id="msg"></div></div>
<div class="stage" id="stage"><div class="loading" id="loading">Yükleniyor…</div><canvas id="c"></canvas><div class="hint">Durdurmak / devam ettirmek için dokun</div></div>
<script>${rendererSrc}</script>
<script>
(async function () {
  const P = ${safeJson(payload)};
  const msg = document.getElementById('msg');
  if (P.typewriter && P.message) {
    msg.classList.add('typing');
    const chars = Array.from(P.message);
    let i = 0;
    (function step() {
      msg.textContent = chars.slice(0, ++i).join('');
      if (i < chars.length) setTimeout(step, chars[i - 1] === '\\n' ? 350 : 55);
      else msg.classList.remove('typing');
    })();
  } else {
    msg.textContent = P.message;
  }
  if (!P.message) msg.parentElement.style.display = 'none';
  const bin = atob(P.data);
  let bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  if (P.gzip) {
    const s = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    bytes = new Uint8Array(await new Response(s).arrayBuffer());
  }
  document.getElementById('loading').remove();
  const canvas = document.getElementById('c');
  const video = new PixelVideo(P.meta, bytes);
  const renderer = new Renderer(canvas, video);
  renderer.setStyle(P.style);
  const player = new Player(renderer);
  function fit() {
    const box = document.getElementById('stage').clientWidth - 24;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = renderer.fitSize(box, window.innerHeight * 0.7);
    renderer.setSize(size[0] * dpr, size[1] * dpr);
    canvas.style.width = size[0] + 'px';
    canvas.style.height = 'auto';
    player.render(true);
  }
  if (window.ResizeObserver) new ResizeObserver(fit).observe(document.getElementById('stage'));
  else window.addEventListener('resize', fit);
  fit();
  player.play();
  document.getElementById('stage').addEventListener('click', () => player.toggle());
})().catch(function (e) {
  document.getElementById('loading').textContent = 'Bu sayfa açılamadı: ' + e.message + ' (güncel bir tarayıcı deneyin)';
});
</script>
</body>
</html>`;
}

export async function shareOrDownload(blob, filename, text) {
    const file = new File([blob], filename, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({ files: [file], title: 'Pixel Art Mesaj', text });
            return 'shared';
        } catch (e) {
            if (e.name === 'AbortError') return 'cancelled';
        }
    }
    downloadBlob(blob, filename);
    return 'downloaded';
}
