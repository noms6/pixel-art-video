// tests/test_gif_encoder.py tarafından çalıştırılır: GifEncoder ile örnek GIF'ler üretir.
// Kullanım: node gif_check.mjs <export.js yolu> <çıktı klasörü>
import { writeFileSync } from 'fs';
import { pathToFileURL } from 'url';
import { join } from 'path';

const [, , exportPath, outDir] = process.argv;
const { GifEncoder } = await import(pathToFileURL(exportPath).href);

function rng(seed) {
    return () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
}

// [ad, renk sayısı, genişlik, yükseklik, frame sayısı] — 256 renkli rastgele veri LZW tablosunu doldurur
const cases = [['pal1', 1, 10, 10, 1], ['pal2', 2, 7, 3, 2], ['pal5', 5, 64, 48, 3], ['pal256', 256, 300, 200, 2]];
for (const [name, n, w, h, frames] of cases) {
    const r = rng(n * 7 + w);
    const palette = Array.from({ length: n }, () => [0, 0, 0].map(() => Math.floor(r() * 256)));
    const enc = new GifEncoder(w, h, palette);
    const all = [];
    for (let f = 0; f < frames; f++) {
        const idx = new Uint8Array(w * h).map(() => Math.floor(r() * n));
        enc.addFrame(idx, 8 + f);
        all.push(Array.from(idx));
    }
    writeFileSync(join(outDir, `${name}.gif`), Buffer.from(await enc.finish().arrayBuffer()));
    writeFileSync(join(outDir, `${name}.json`), JSON.stringify({ palette, frames: all }));
}
