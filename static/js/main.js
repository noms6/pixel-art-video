import { createJob, getConfig, uploadVideo, waitForJob } from './api.js';
import { PixelVideo, Player, Renderer } from './renderer.js';
import { BACKGROUNDS, THEMES, modeOptions, styleFor } from './shapes.js';
import { buildStandaloneHtml, downloadBlob, encodeGif, recordVideo, shareOrDownload, supportedVideoFormat } from './export.js';

const $ = (id) => document.getElementById(id);

const state = {
    config: null,
    file: null,
    upload: null,          // {upload_id, info}
    video: null,           // PixelVideo
    task: null,            // AbortController (yükleme/dönüştürme)
    jobId: null,
    exportTask: null,      // AbortController (dışa aktarma)
    objectUrl: null,
    preview: null,         // {renderer, player}
    result: null,
};

// ------------------------------------------------------------------ yardımcılar

const storage = {
    get(key, fallback) {
        try {
            const v = localStorage.getItem(`pav.${key}`);
            return v === null ? fallback : JSON.parse(v);
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(`pav.${key}`, JSON.stringify(value));
        } catch {
            // gizli mod vb.
        }
    },
};

let toastTimer = null;
function toast(message, kind = 'info', ms = 4500) {
    const el = $('toast');
    el.textContent = message;
    el.className = `toast show ${kind}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.className = 'toast'), ms);
}

function showStep(name) {
    for (const id of ['stepUpload', 'stepProcess', 'stepPreview', 'stepResult']) $(id).hidden = id !== name;
    $('convCard').hidden = !(name === 'stepUpload' || name === 'stepPreview');
    // Ayar kartı, bulunduğumuz adımın hemen altında dursun
    if (name === 'stepUpload' || name === 'stepPreview') $(name).after($('convCard'));
    $('reconvertBtn').hidden = !state.upload;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fillSelect(select, options, value) {
    select.innerHTML = '';
    for (const opt of options) {
        if (opt.items) {
            const group = document.createElement('optgroup');
            group.label = opt.label;
            for (const [v, l] of opt.items) group.append(new Option(l, v));
            select.append(group);
        } else {
            select.append(new Option(opt[1], opt[0]));
        }
    }
    if (value !== undefined && [...select.options].some((o) => o.value === value)) select.value = value;
}

function isAbort(e) {
    return e && e.name === 'AbortError';
}

// ------------------------------------------------------------------ tema & arka plan

function applyTheme(id) {
    const t = THEMES[id] || THEMES.romantic;
    const root = document.documentElement.style;
    root.setProperty('--bg-start', t.start);
    root.setProperty('--bg-end', t.end);
    root.setProperty('--primary', t.primary);
    root.setProperty('--secondary', t.secondary);
    storage.set('theme', id);
}

function applyBackground(id) {
    document.querySelector('.background-elements')?.remove();
    storage.set('bg', id);
    const bg = BACKGROUNDS[id];
    if (!bg || !bg.symbols) return;
    const box = document.createElement('div');
    box.className = 'background-elements';
    box.setAttribute('aria-hidden', 'true');
    const count = window.innerWidth < 700 ? Math.ceil(bg.count / 2) : bg.count;
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = `bg-element ${bg.cls}`;
        el.textContent = bg.symbols[i % bg.symbols.length];
        el.style.left = `${Math.random() * 100}%`;
        el.style.top = `${Math.random() * 100}%`;
        el.style.animationDelay = `${(Math.random() * -10).toFixed(2)}s`;
        el.style.fontSize = `${(Math.random() + 1).toFixed(2)}rem`;
        box.append(el);
    }
    document.body.prepend(box);
}

// ------------------------------------------------------------------ dönüştürme ayarları

const CONV_FIELDS = ['pixelSize', 'fps', 'palette', 'colors', 'dither', 'start', 'end', 'maxFrames', 'brightness', 'contrast', 'saturation'];
const CONV_DEFAULTS = { pixelSize: '8', fps: '10', palette: 'auto', colors: '16', dither: 'none', start: '0', end: '0', maxFrames: '0', brightness: '0', contrast: '0', saturation: '100' };

function readConvParams() {
    const v = (id) => $(id).value;
    return {
        pixel_size: Number(v('pixelSize')),
        fps: Number(v('fps')),
        palette: v('palette'),
        colors: Number(v('colors')),
        dither: v('dither'),
        start: Number(v('start')) || 0,
        end: Number(v('end')) || 0,
        max_frames: Math.max(0, Math.floor(Number(v('maxFrames')) || 0)),
        brightness: Number(v('brightness')),
        contrast: Number(v('contrast')),
        saturation: Number(v('saturation')),
    };
}

function validateConvParams(p) {
    if (p.end && p.end <= p.start) return 'Bitiş zamanı başlangıçtan büyük olmalı';
    const dur = state.upload && state.upload.info.duration;
    if (dur && p.start >= dur) return `Başlangıç, video süresinden (${dur.toFixed(1)} sn) küçük olmalı`;
    return null;
}

function updateConvUi() {
    for (const id of ['pixelSize', 'colors', 'brightness', 'contrast', 'saturation']) $(`${id}Out`).textContent = $(id).value;
    const paletteId = $('palette').value;
    $('colorsField').hidden = paletteId !== 'auto';
    const preset = state.config && state.config.palettes.find((p) => p.id === paletteId);
    const swatches = $('paletteSwatches');
    swatches.innerHTML = '';
    for (const c of (preset && preset.colors) || []) {
        const s = document.createElement('i');
        s.style.background = `rgb(${c.join(',')})`;
        swatches.append(s);
    }
    const p = readConvParams();
    $('convSummary').textContent = `· ${p.pixel_size}px · ${p.fps || 'orijinal'} fps · ${$('palette').selectedOptions[0]?.text || ''}`;
    storage.set('conv', Object.fromEntries(CONV_FIELDS.map((id) => [id, $(id).value])));
}

function setupConvSettings() {
    fillSelect($('palette'), state.config.palettes.map((p) => [p.id, p.label]));
    const saved = storage.get('conv', {});
    for (const id of CONV_FIELDS) {
        const value = saved[id] ?? CONV_DEFAULTS[id];
        if ($(id).tagName !== 'SELECT' || [...$(id).options].some((o) => o.value === value)) $(id).value = value;
        $(id).addEventListener('input', updateConvUi);
    }
    $('resetConvBtn').addEventListener('click', () => {
        for (const id of CONV_FIELDS) $(id).value = CONV_DEFAULTS[id];
        updateConvUi();
    });
    $('reconvertBtn').addEventListener('click', () => state.upload && convert());
    updateConvUi();
}

// ------------------------------------------------------------------ yükleme & dönüştürme

function setProgress(value, text) {
    $('progressFill').style.width = `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`;
    if (text) $('progressText').textContent = text;
}

function stopEverything() {
    if (state.task) state.task.abort();
    if (state.exportTask) state.exportTask.abort();
    state.task = null;
    state.preview?.player.pause();
    state.result?.player.pause();
    $('originalVideo').pause();
}

async function handleFile(file) {
    if (!file) return;
    if (!state.config) {
        toast('Uygulama hâlâ hazırlanıyor, birkaç saniye sonra tekrar dene');
        return;
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const allowed = state.config.extensions;
    if (!allowed.includes(ext) && !(file.type || '').startsWith('video/')) {
        toast(`Bu bir video dosyası değil gibi görünüyor (.${ext})`, 'error');
        return;
    }
    if (file.size > state.config.max_upload_mb * 1024 * 1024) {
        toast(`Dosya çok büyük (en fazla ${state.config.max_upload_mb} MB)`, 'error');
        return;
    }
    stopEverything();
    state.file = file;
    state.upload = null;
    state.video = null;
    if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
    state.objectUrl = URL.createObjectURL(file);
    const original = $('originalVideo');
    $('originalNote').hidden = true;
    original.hidden = false;
    original.src = state.objectUrl;

    const task = new AbortController();
    state.task = task;
    showStep('stepProcess');
    setProgress(0, 'Video yükleniyor…');
    try {
        state.upload = await uploadVideo(file, (p) => setProgress(p * 0.25, `Video yükleniyor… %${Math.round(p * 100)}`), task.signal);
    } catch (e) {
        if (state.task !== task) return;
        state.task = null;
        showStep('stepUpload');
        if (!isAbort(e)) toast(e.message, 'error', 8000);
        return;
    }
    if (state.task !== task) return;
    const info = state.upload.info;
    if (info.duration && Number($('end').value) > info.duration) $('end').value = '0';
    await convert(task);
}

async function convert(existingTask) {
    const params = readConvParams();
    const problem = validateConvParams(params);
    if (problem) {
        toast(problem, 'error');
        $('convSettings').open = true;
        if (!state.video) showStep('stepUpload');
        return;
    }
    if (!existingTask) stopEverything();
    const task = existingTask || new AbortController();
    state.task = task;
    showStep('stepProcess');
    setProgress(0.25, 'Dönüştürme başlatılıyor…');
    try {
        const job = await createJob(state.upload.upload_id, params);
        state.jobId = job.id;
        const { meta, frames } = await waitForJob(job.id, (p, stage) => setProgress(0.25 + p * 0.7, stage), task.signal);
        if (state.task !== task) return;
        setProgress(1, 'Hazır!');
        state.video = new PixelVideo(meta, frames);
        state.meta = meta;
        state.task = null;
        showPreview();
    } catch (e) {
        if (state.task !== task) return;
        state.task = null;
        if (isAbort(e)) {
            toast('İşlem iptal edildi');
        } else {
            toast(e.message, 'error', 8000);
        }
        if (state.video) showPreview();
        else showStep('stepUpload');
    }
}

// ------------------------------------------------------------------ oynatıcı arayüzü

function buildPlayerUi(container, player) {
    const v = player.renderer.video;
    container.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'btn btn-small';
    btn.type = 'button';
    const range = document.createElement('input');
    range.type = 'range';
    range.min = 0;
    range.max = v.frameCount - 1;
    range.value = 0;
    range.setAttribute('aria-label', 'Konum');
    const time = document.createElement('span');
    time.className = 'time';
    const speed = document.createElement('select');
    speed.setAttribute('aria-label', 'Hız');
    for (const s of [0.5, 1, 1.5, 2]) speed.append(new Option(`${s}×`, s));
    speed.value = '1';
    const total = (v.frameCount / v.fps).toFixed(1);
    const sync = () => (btn.textContent = player.playing ? '⏸' : '▶');
    player.onFrame = (i) => {
        range.value = i;
        time.textContent = `${(i / v.fps).toFixed(1)} / ${total} sn`;
    };
    btn.addEventListener('click', () => {
        player.toggle();
        sync();
    });
    range.addEventListener('input', () => {
        player.pause();
        player.seek(Number(range.value));
        sync();
    });
    speed.addEventListener('change', () => (player.speed = Number(speed.value)));
    container.append(btn, range, time, speed);
    sync();
    return sync;
}

function fitRenderer(entry, box) {
    if (!entry) return;
    const { renderer, player } = entry;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = box.clientWidth;
    const [w, h] = renderer.fitSize(width, Math.max(200, window.innerHeight * 0.65));
    renderer.setSize(w * dpr, h * dpr);
    renderer.canvas.style.width = `${w}px`;
    renderer.canvas.style.height = 'auto';
    player.render(true);
}

// ------------------------------------------------------------------ önizleme

function showPreview() {
    if (!state.video) return showStep('stepUpload');
    state.result?.player.pause();
    showStep('stepPreview');
    const renderer = new Renderer($('pixelCanvas'), state.video);
    renderer.setStyle({ mode: 'pixel' });
    const player = new Player(renderer);
    state.preview?.player.pause();
    state.preview = { renderer, player };
    const sync = buildPlayerUi($('previewPlayer'), player);
    fitRenderer(state.preview, $('pixelBox'));
    player.play();
    sync();
    const m = state.meta;
    const src = m.source;
    $('infoLine').textContent = `${m.frame_count} frame · ${m.fps} fps · ${(m.frame_count / m.fps).toFixed(1)} sn · grid ${m.width}×${m.height}` +
        ` · ${m.palette.length} renk · kaynak ${src.width}×${src.height}` +
        (m.pixel_size !== m.params.pixel_size ? ` · pixel boyutu otomatik ${m.pixel_size} yapıldı (çözünürlük sınırı)` : '');
    const original = $('originalVideo');
    original.play().catch(() => {});
}

// ------------------------------------------------------------------ sonuç

const STYLE_FIELDS = ['modeSelect', 'scale', 'density', 'mix'];

function currentStyle() {
    return styleFor($('modeSelect').value, {
        scale: Number($('scale').value),
        density: Number($('density').value) / 100,
        mix: Number($('mix').value) / 100,
    });
}

function updateStyleUi() {
    const mode = $('modeSelect').value;
    const isShape = mode.startsWith('shape:');
    $('scaleField').hidden = mode === 'pixel';
    $('densityField').hidden = !isShape;
    $('mixField').hidden = !isShape;
    for (const id of ['scale', 'density', 'mix']) $(`${id}Out`).textContent = $(id).value;
    storage.set('style', Object.fromEntries(STYLE_FIELDS.map((id) => [id, $(id).value])));
}

function applyStyle() {
    updateStyleUi();
    if (!state.result) return;
    state.result.renderer.setStyle(currentStyle());
    state.result.player.render(true);
}

function showResult() {
    if (!state.video) return showStep('stepUpload');
    state.preview?.player.pause();
    $('originalVideo').pause();
    showStep('stepResult');
    const renderer = new Renderer($('resultCanvas'), state.video);
    renderer.setStyle(currentStyle());
    const player = new Player(renderer);
    state.result?.player.pause();
    state.result = { renderer, player };
    const sync = buildPlayerUi($('resultPlayer'), player);
    fitRenderer(state.result, $('resultBox'));
    player.play();
    sync();
}

// ------------------------------------------------------------------ dışa aktarma

function exportRenderer() {
    const width = Number($('exportSize').value);
    const canvas = document.createElement('canvas');
    const renderer = new Renderer(canvas, state.video);
    let [w, h] = renderer.fitSize(width, width * 4);
    w -= w % 2;
    h -= h % 2; // video kodlayıcılar çift boyut ister
    renderer.setSize(w, h);
    const style = currentStyle();
    if (style.mode !== 'pixel') {
        const t = THEMES[$('themeSelect').value];
        style.background = { start: t.start, end: t.end };
    }
    renderer.setStyle(style);
    return renderer;
}

function setExporting(active, text) {
    for (const id of ['downloadBtn', 'saveBtn', 'shareBtn']) $(id).disabled = active;
    $('exportProgress').hidden = !active;
    if (text) $('exportText').textContent = text;
}

async function runExport(label, fn) {
    if (state.exportTask) return;
    const task = new AbortController();
    state.exportTask = task;
    setExporting(true, `${label}…`);
    $('exportFill').style.width = '0%';
    const progress = (p) => {
        $('exportFill').style.width = `${Math.round(p * 100)}%`;
        $('exportText').textContent = `${label}… %${Math.round(p * 100)}`;
    };
    try {
        await fn(progress, task.signal);
    } catch (e) {
        if (isAbort(e)) toast('Dışa aktarma iptal edildi');
        else toast(`Dışa aktarma başarısız: ${e.message}`, 'error', 8000);
    } finally {
        state.exportTask = null;
        setExporting(false);
    }
}

function download() {
    const format = $('exportFormat').value;
    const v = state.video;
    const base = `pixel_art_${$('modeSelect').value.replace(/[^a-z0-9]+/gi, '_')}`;
    if (format === 'gif') {
        return runExport('GIF oluşturuluyor', async (progress, signal) => {
            const renderer = exportRenderer();
            const blob = await encodeGif({ renderer, frameCount: v.frameCount, fps: v.fps, onProgress: progress, signal });
            downloadBlob(blob, `${base}.gif`);
            toast(`GIF hazır (${(blob.size / 1e6).toFixed(1)} MB)`, 'success');
        });
    }
    const chosen = supportedVideoFormat(format);
    if (!chosen) {
        toast('Bu tarayıcı video kaydını desteklemiyor; GIF deneyebilirsin', 'error');
        return;
    }
    if (chosen.format !== format) toast(`Tarayıcı ${format.toUpperCase()} kaydı desteklemiyor, ${chosen.format.toUpperCase()} olarak kaydediliyor`);
    return runExport('Video kaydediliyor', async (progress, signal) => {
        const renderer = exportRenderer();
        const { blob, ext } = await recordVideo({ renderer, frameCount: v.frameCount, fps: v.fps, format, onProgress: progress, signal });
        downloadBlob(blob, `${base}.${ext}`);
        toast(`Video hazır (${(blob.size / 1e6).toFixed(1)} MB)`, 'success');
    });
}

async function standaloneBlob() {
    const t = THEMES[$('themeSelect').value];
    const html = await buildStandaloneHtml({
        video: state.video,
        style: currentStyle(),
        theme: t,
        message: $('messageText').value,
        typewriter: $('typewriter').checked,
        title: $('pageTitle').value,
    });
    return new Blob([html], { type: 'text/html' });
}

function saveSite() {
    return runExport('Sayfa hazırlanıyor', async () => {
        const blob = await standaloneBlob();
        downloadBlob(blob, 'pixel_art_mesaj.html');
        toast(`Sayfa kaydedildi (${(blob.size / 1024).toFixed(0)} KB) — bu dosyayı gönderebilirsin`, 'success');
    });
}

function share() {
    return runExport('Paylaşım hazırlanıyor', async () => {
        const blob = await standaloneBlob();
        const result = await shareOrDownload(blob, 'pixel_art_mesaj.html', $('messageText').value);
        if (result === 'downloaded') {
            toast('Paylaşım bu tarayıcıda desteklenmiyor; dosya indirildi, WhatsApp veya e-posta ile gönderebilirsin', 'info', 8000);
        }
    });
}

// ------------------------------------------------------------------ başlangıç

function setupUpload() {
    const box = $('uploadBox');
    const input = $('videoInput');
    box.addEventListener('click', () => input.click());
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            input.click();
        }
    });
    box.addEventListener('dragover', (e) => {
        e.preventDefault();
        box.classList.add('dragover');
    });
    box.addEventListener('dragleave', () => box.classList.remove('dragover'));
    box.addEventListener('drop', (e) => {
        e.preventDefault();
        box.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', () => {
        handleFile(input.files[0]);
        input.value = ''; // aynı dosya tekrar seçilebilsin
    });
    $('originalVideo').addEventListener('error', () => {
        if (!state.objectUrl) return;
        $('originalVideo').hidden = true;
        $('originalNote').hidden = false;
    });
}

function goToUpload() {
    stopEverything();
    showStep('stepUpload');
}

async function init() {
    fillSelect($('themeSelect'), Object.entries(THEMES).map(([k, t]) => [k, t.label]), storage.get('theme', 'romantic'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    fillSelect($('bgSelect'), Object.entries(BACKGROUNDS).map(([k, b]) => [k, b.label]), storage.get('bg', reduced ? 'none' : 'hearts'));
    applyTheme($('themeSelect').value);
    applyBackground($('bgSelect').value);
    $('themeSelect').addEventListener('change', (e) => applyTheme(e.target.value));
    $('bgSelect').addEventListener('change', (e) => applyBackground(e.target.value));

    fillSelect($('modeSelect'), modeOptions());
    const style = storage.get('style', {});
    for (const id of STYLE_FIELDS) {
        if (style[id] !== undefined && (id !== 'modeSelect' || [...$(id).options].some((o) => o.value === style[id]))) $(id).value = style[id];
        else if (id === 'modeSelect') $(id).value = 'shape:rose';
        $(id).addEventListener('input', applyStyle);
    }
    updateStyleUi();
    setupUpload();

    try {
        state.config = await getConfig();
    } catch (e) {
        toast(`Sunucuya bağlanılamadı: ${e.message}`, 'error', 15000);
        return;
    }
    $('formatHint').textContent = `${state.config.extensions.map((e) => e.toUpperCase()).join(', ')} · en fazla ${state.config.max_upload_mb} MB`;
    setupConvSettings();

    // İptal sinyali hem yüklemeyi hem sunucudaki dönüştürme işini durdurur (bkz. api.waitForJob)
    $('cancelBtn').addEventListener('click', () => state.task && state.task.abort());
    $('startBtn').addEventListener('click', showResult);
    $('backBtn').addEventListener('click', showPreview);
    $('newVideoBtn').addEventListener('click', goToUpload);
    $('newVideoBtn2').addEventListener('click', goToUpload);
    $('downloadBtn').addEventListener('click', download);
    $('saveBtn').addEventListener('click', saveSite);
    $('shareBtn').addEventListener('click', share);
    $('exportCancelBtn').addEventListener('click', () => state.exportTask && state.exportTask.abort());

    // Kutu boyutu değişince (pencere, kaydırma çubuğu, mobil döndürme) canvas'ı yeniden sığdır
    let resizeTimer = null;
    const refit = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!$('stepPreview').hidden) fitRenderer(state.preview, $('pixelBox'));
            if (!$('stepResult').hidden) fitRenderer(state.result, $('resultBox'));
        }, 100);
    };
    if (window.ResizeObserver) {
        const observer = new ResizeObserver(refit);
        observer.observe($('pixelBox'));
        observer.observe($('resultBox'));
    } else {
        window.addEventListener('resize', refit);
    }
    showStep('stepUpload');
}

init();
