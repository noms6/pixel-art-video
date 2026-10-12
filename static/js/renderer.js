// Pixel art çizim motoru.
//
// Bu dosya bağımsızdır (import yok): "Siteyi Kaydet" ile oluşturulan tek dosyalık HTML'e
// kaynak kodu olduğu gibi gömülür. Bu yüzden yalnızca standart Canvas API'leri kullanır.
//
// Veri modeli: her frame, width × height boyutunda palet indeksleri (Uint8Array) içerir.
// Palet sabit olduğu için her palet rengi için şekil/karakter bir kez çizilip önbelleğe
// alınır (sprite); frame çizimi yalnızca drawImage çağrılarından oluşur.

export const DEFAULT_ASCII = ' .:-=+*#%@';

export function luminance(c) {
    return (c[0] * 299 + c[1] * 587 + c[2] * 114) / 255000;
}

export class PixelVideo {
    constructor(meta, frames) {
        this.width = meta.width;
        this.height = meta.height;
        this.fps = meta.fps;
        this.frameCount = meta.frame_count;
        this.palette = meta.palette;
        this.frames = frames;
        this.frameSize = this.width * this.height;
        this.lum = this.palette.map(luminance);
        const rgba = new Uint32Array(this.palette.length);
        const little = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;
        this.palette.forEach((c, i) => {
            rgba[i] = little
                ? (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0]
                : (c[0] << 24) | (c[1] << 16) | (c[2] << 8) | 255;
        });
        this.rgba = rgba;
    }

    frame(i) {
        const n = ((i % this.frameCount) + this.frameCount) % this.frameCount;
        return this.frames.subarray(n * this.frameSize, (n + 1) * this.frameSize);
    }
}

function mixColor(base, video, ratio) {
    return [
        Math.round(base[0] * (1 - ratio) + video[0] * ratio),
        Math.round(base[1] * (1 - ratio) + video[1] * ratio),
        Math.round(base[2] * (1 - ratio) + video[2] * ratio),
    ];
}

function makeCanvas(w, h) {
    if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
}

// Hücre için deterministik "rastgele" değer (0..1) — yoğunluk < 1 iken hangi hücrelerin
// çizileceğini belirler. Frame'den bağımsızdır, böylece çiçekler yerinde sabit kalır.
function cellHash(x, y) {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

const BRAILLE_BITS = [[0x01, 0x08], [0x02, 0x10], [0x04, 0x20], [0x40, 0x80]];

export class Renderer {
    constructor(canvas, video) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.video = video;
        this.small = makeCanvas(video.width, video.height);
        this.smallCtx = this.small.getContext('2d');
        this.smallImage = this.smallCtx.createImageData(video.width, video.height);
        this.smallPixels = new Uint32Array(this.smallImage.data.buffer);
        this.style = { mode: 'pixel', shape: null, chars: DEFAULT_ASCII, scale: 3, density: 1, mix: 0.7, background: null };
        this.sprites = null;
        this.braille = new Map();
    }

    setStyle(style) {
        this.style = Object.assign({}, this.style, style);
        this.sprites = null;
        this.braille.clear();
    }

    // Canvas çözünürlüğünü ayarla (piksel cinsinden); en-boy oranı videodan gelir.
    setSize(width, height) {
        width = Math.max(1, Math.round(width));
        height = Math.max(1, Math.round(height));
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.sprites = null;
            this.braille.clear();
        }
    }

    fitSize(maxWidth, maxHeight) {
        const aspect = this.video.width / this.video.height;
        let w = maxWidth;
        let h = w / aspect;
        if (h > maxHeight) {
            h = maxHeight;
            w = h * aspect;
        }
        return [Math.max(1, Math.round(w)), Math.max(1, Math.round(h))];
    }

    // Ekran pikseli başına ölçek: canvas genişliği 1000 px referansına göre.
    unit() {
        return Math.max(0.25, this.canvas.width / 1000);
    }

    cellSize() {
        const s = this.style;
        const u = this.unit();
        if (s.mode === 'shape') return Math.max(2, Math.round(s.shape.size * s.scale * u));
        // ASCII/Braille: karakter yüksekliği (en az 6 px — daha küçüğü okunmaz ve çok yavaş)
        return Math.max(6, Math.round((s.scale + 1) * 2.5 * u));
    }

    // Her palet rengi için bir sprite; hepsi tek bir atlas dokusunda (tek GPU dokusu,
    // binlerce küçük canvas'tan çizmekten çok daha hızlı). Boş sprite'ın slotu -1'dir.
    buildSprites() {
        const s = this.style;
        const v = this.video;
        const cellH = this.cellSize();
        const cellW = s.mode === 'ascii' ? Math.max(2, Math.round(cellH * 0.6)) : cellH;
        const atlas = new Atlas(cellW, cellH, v.palette.length);
        const slots = new Int32Array(v.palette.length).fill(-1);
        if (s.mode === 'shape') {
            const shape = s.shape;
            const px = cellH / shape.size;
            v.palette.forEach((color, i) => {
                const colors = shape.colors.map((base, k) => (k === 0 ? null : mixColor(base, color, s.mix)));
                slots[i] = atlas.add((g, ox, oy) => {
                    for (let y = 0; y < shape.size; y++) {
                        for (let x = 0; x < shape.size; x++) {
                            const k = shape.pixels[y][x];
                            if (!k) continue;
                            const col = colors[k];
                            g.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
                            g.fillRect(ox + Math.floor(x * px), oy + Math.floor(y * px), Math.ceil(px), Math.ceil(px));
                        }
                    }
                });
            });
        } else if (s.mode === 'ascii') {
            const chars = s.chars || DEFAULT_ASCII;
            v.palette.forEach((color, i) => {
                const ch = chars[Math.min(chars.length - 1, Math.floor(v.lum[i] * chars.length))];
                if (ch === ' ') return;
                slots[i] = atlas.add((g, ox, oy) => {
                    g.font = `bold ${cellH}px "Courier New", Consolas, monospace`;
                    g.textBaseline = 'top';
                    g.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
                    g.fillText(ch, ox, oy + Math.round(cellH * 0.05));
                });
            });
        }
        this.sprites = { atlas, slots, cellW, cellH };
    }

    clear() {
        const { ctx, canvas, style } = this;
        if (style.background) {
            const bg = style.background;
            if (bg.start) {
                const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                grad.addColorStop(0, bg.start);
                grad.addColorStop(1, bg.end || bg.start);
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = bg;
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    draw(frameIndex) {
        const v = this.video;
        const data = v.frame(frameIndex);
        const mode = this.style.mode;
        this.clear();
        if (mode === 'pixel') return this.drawPixel(data);
        if (mode === 'braille') return this.drawBraille(data);
        if (!this.sprites) this.buildSprites();
        return this.drawCells(data);
    }

    drawPixel(data) {
        const px = this.smallPixels;
        const rgba = this.video.rgba;
        for (let i = 0; i < data.length; i++) px[i] = rgba[data[i]];
        this.smallCtx.putImageData(this.smallImage, 0, 0);
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(this.small, 0, 0, this.canvas.width, this.canvas.height);
    }

    drawCells(data) {
        const { ctx, canvas, video: v, style } = this;
        const { atlas, slots, cellW, cellH } = this.sprites;
        const cols = Math.ceil(canvas.width / cellW);
        const rows = Math.ceil(canvas.height / cellH);
        const density = style.mode === 'shape' ? style.density : 1;
        const img = atlas.canvas;
        ctx.imageSmoothingEnabled = false;
        for (let r = 0; r < rows; r++) {
            const gy = Math.min(v.height - 1, Math.floor(((r + 0.5) * v.height) / rows));
            const rowOffset = gy * v.width;
            const dy = r * cellH;
            for (let c = 0; c < cols; c++) {
                if (density < 1 && cellHash(c, r) >= density) continue;
                const gx = Math.min(v.width - 1, Math.floor(((c + 0.5) * v.width) / cols));
                const slot = slots[data[rowOffset + gx]];
                if (slot < 0) continue;
                ctx.drawImage(img, atlas.sx(slot), atlas.sy(slot), cellW, cellH, c * cellW, dy, cellW, cellH);
            }
        }
    }

    drawBraille(data) {
        const { ctx, canvas, video: v } = this;
        const cellH = this.cellSize();
        const cellW = Math.max(2, Math.round(cellH * 0.6));
        const cols = Math.ceil(canvas.width / cellW);
        const rows = Math.ceil(canvas.height / cellH);
        const subW = cols * 2;
        const subH = rows * 4;
        // Frame'in ortalama parlaklığı eşik olarak kullanılır (karanlık videolar da görünür)
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += v.lum[data[i]];
        const threshold = sum / data.length;
        let atlas = this.brailleAtlas;
        if (!atlas || atlas.w !== cellW || atlas.h !== cellH || atlas.full()) {
            atlas = this.brailleAtlas = new Atlas(cellW, cellH, 4096);
            this.braille.clear();
        }
        const font = `${cellH}px "Segoe UI Symbol", "DejaVu Sans", monospace`;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let bits = 0;
                let brightest = -1;
                let colorIndex = 0;
                for (let dy = 0; dy < 4; dy++) {
                    const gy = Math.min(v.height - 1, Math.floor(((r * 4 + dy + 0.5) * v.height) / subH));
                    for (let dx = 0; dx < 2; dx++) {
                        const gx = Math.min(v.width - 1, Math.floor(((c * 2 + dx + 0.5) * v.width) / subW));
                        const idx = data[gy * v.width + gx];
                        const lum = v.lum[idx];
                        if (lum > threshold) bits |= BRAILLE_BITS[dy][dx];
                        if (lum > brightest) {
                            brightest = lum;
                            colorIndex = idx;
                        }
                    }
                }
                if (!bits) continue;
                const key = bits * 256 + colorIndex;
                let slot = this.braille.get(key);
                if (slot === undefined) {
                    const col = v.palette[colorIndex];
                    slot = atlas.add((g, ox, oy) => {
                        g.font = font;
                        g.textBaseline = 'top';
                        g.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
                        g.fillText(String.fromCharCode(0x2800 + bits), ox, oy);
                    });
                    this.braille.set(key, slot);
                }
                if (slot >= 0) ctx.drawImage(atlas.canvas, atlas.sx(slot), atlas.sy(slot), cellW, cellH, c * cellW, r * cellH, cellW, cellH);
            }
        }
    }
}

// Sabit boyutlu hücrelerden oluşan sprite atlası (tek canvas).
class Atlas {
    constructor(cellW, cellH, capacity) {
        this.w = cellW;
        this.h = cellH;
        this.cols = Math.max(1, Math.floor(4096 / cellW));
        const rows = Math.max(1, Math.min(Math.floor(4096 / cellH), Math.ceil(capacity / this.cols)));
        this.capacity = Math.min(capacity, this.cols * rows);
        this.canvas = makeCanvas(Math.min(this.cols, this.capacity) * cellW, rows * cellH);
        this.ctx = this.canvas.getContext('2d');
        this.count = 0;
    }

    full() {
        return this.count >= this.capacity;
    }

    sx(slot) {
        return (slot % this.cols) * this.w;
    }

    sy(slot) {
        return Math.floor(slot / this.cols) * this.h;
    }

    // paint(ctx, x, y) hücreyi çizer; hücre dışına taşma kırpılır. Atlas doluysa -1.
    add(paint) {
        if (this.full()) return -1;
        const slot = this.count++;
        const x = this.sx(slot);
        const y = this.sy(slot);
        const g = this.ctx;
        g.save();
        g.beginPath();
        g.rect(x, y, this.w, this.h);
        g.clip();
        paint(g, x, y);
        g.restore();
        return slot;
    }
}

// Zaman tabanlı oynatıcı: frame indeksi geçen süreden hesaplanır, böylece çizim yavaş
// olsa bile video doğru hızda oynar (gerekirse frame atlanır).
export class Player {
    constructor(renderer, onFrame) {
        this.renderer = renderer;
        this.onFrame = onFrame || null;
        this.speed = 1;
        this.playing = false;
        this.position = 0; // saniye
        this.lastFrame = -1;
        this.raf = null;
        this.tick = this.tick.bind(this);
    }

    get frameIndex() {
        const v = this.renderer.video;
        return Math.floor(this.position * v.fps) % v.frameCount;
    }

    play() {
        if (this.playing) return;
        this.playing = true;
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.tick);
    }

    pause() {
        this.playing = false;
        if (this.raf) cancelAnimationFrame(this.raf);
        this.raf = null;
    }

    toggle() {
        this.playing ? this.pause() : this.play();
    }

    seek(frame) {
        const v = this.renderer.video;
        this.position = Math.max(0, Math.min(v.frameCount - 1, frame)) / v.fps;
        this.render(true);
    }

    render(force) {
        const i = this.frameIndex;
        if (force || i !== this.lastFrame) {
            this.renderer.draw(i);
            this.lastFrame = i;
            if (this.onFrame) this.onFrame(i);
        }
    }

    tick(now) {
        if (!this.playing) return;
        const v = this.renderer.video;
        const duration = v.frameCount / v.fps;
        // Sekme arka plandayken biriken süreyi tek seferde atlama
        const dt = Math.min(0.25, (now - this.last) / 1000);
        this.last = now;
        this.position = (this.position + dt * this.speed) % duration;
        this.render(false);
        this.raf = requestAnimationFrame(this.tick);
    }
}
