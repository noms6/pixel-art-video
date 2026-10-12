import { createJob, getConfig, uploadVideo, waitForJob } from './api.js';
import { PixelVideo, Player, Renderer } from './renderer.js';
import { BACKGROUNDS, THEMES, modeOptions, styleFor } from './shapes.js';
import { buildStandaloneHtml, downloadBlob, encodeGif, recordVideo, shareOrDownload, supportedVideoFormat } from './export.js';
import { LANGUAGES, detectLanguage, errorText, isRtl, language, setLanguage, t } from './i18n.js';

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
    const theme = THEMES[id] || THEMES.romantic;
    const root = document.documentElement.style;
    root.setProperty('--bg-start', theme.start);
    root.setProperty('--bg-end', theme.end);
    root.setProperty('--primary', theme.primary);
    root.setProperty('--secondary', theme.secondary);
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

// Dile bağlı seçim kutularını (tema, arka plan, stil, palet) seçili değeri koruyarak doldur
function fillLocalizedSelects() {
    const keep = (id) => $(id).value || undefined;
    fillSelect($('themeSelect'), Object.entries(THEMES).map(([k, th]) => [k, `${th.emoji} ${t(`theme.${k}`)}`]), keep('themeSelect'));
    fillSelect($('bgSelect'), Object.entries(BACKGROUNDS).map(([k, b]) => [k, `${b.emoji} ${t(`bg.${k}`)}`]), keep('bgSelect'));
    fillSelect($('modeSelect'), modeOptions(t), keep('modeSelect'));
    if (state.config) fillSelect($('palette'), state.config.palettes.map((p) => [p.id, t(`palette.${p.id}`)]), keep('palette'));
}

async function changeLanguage(code) {
    await setLanguage(code);
    storage.set('lang', language());
    fillLocalizedSelects();
    if (state.config) {
        updateConvUi();
        $('formatHint').textContent = t('upload.formats', {
            formats: state.config.extensions.map((e) => e.toUpperCase()).join(', '),
            mb: state.config.max_upload_mb,
        });
    }
    updateStyleUi();
    if (state.meta) updateInfoLine();
    for (const entry of [state.preview, state.result]) entry && entry.player.onFrame && entry.player.onFrame(entry.player.frameIndex);
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
    if (p.end && p.end <= p.start) return t('err.end_before_start');
    const dur = state.upload && state.upload.info.duration;
    if (dur && p.start >= dur) return t('err.start_after_duration', { start: p.start, duration: dur.toFixed(1) });
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
    $('convSummary').textContent = t('conv.summary', {
        size: p.pixel_size,
        fps: p.fps || t('conv.original'),
        palette: $('palette').selectedOptions[0]?.text || '',
    });
    storage.set('conv', Object.fromEntries(CONV_FIELDS.map((id) => [id, $(id).value])));
}

function setupConvSettings() {
    fillSelect($('palette'), state.config.palettes.map((p) => [p.id, t(`palette.${p.id}`)]));
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
        toast(t('toast.not_ready'));
        return;
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const allowed = state.config.extensions;
    if (!allowed.includes(ext) && !(file.type || '').startsWith('video/')) {
        toast(t('toast.not_video', { ext }), 'error');
        return;
    }
    if (file.size > state.config.max_upload_mb * 1024 * 1024) {
        toast(t('err.too_big', { mb: state.config.max_upload_mb }), 'error');
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
    setProgress(0, t('process.uploading', { p: 0 }));
    try {
        state.upload = await uploadVideo(file, (p) => setProgress(p * 0.25, t('process.uploading', { p: Math.round(p * 100) })), task.signal);
    } catch (e) {
        if (state.task !== task) return;
        state.task = null;
        showStep('stepUpload');
        if (!isAbort(e)) toast(errorText(e), 'error', 8000);
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
    setProgress(0.25, t('process.starting'));
    try {
        const job = await createJob(state.upload.upload_id, params);
        state.jobId = job.id;
        const onProgress = (p, code, params) => setProgress(0.25 + p * 0.7, code ? t(`stage.${code}`, params) : '');
        const { meta, frames } = await waitForJob(job.id, onProgress, task.signal);
        if (state.task !== task) return;
        setProgress(1, t('process.ready'));
        state.video = new PixelVideo(meta, frames);
        state.meta = meta;
        state.task = null;
        showPreview();
    } catch (e) {
        if (state.task !== task) return;
        state.task = null;
        if (isAbort(e)) toast(t('toast.cancelled'));
        else toast(errorText(e), 'error', 8000);
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
    range.dataset.i18nAria = 'player.position';
    range.setAttribute('aria-label', t('player.position'));
    const time = document.createElement('span');
    time.className = 'time';
    const speed = document.createElement('select');
    speed.dataset.i18nAria = 'player.speed';
    speed.setAttribute('aria-label', t('player.speed'));
    for (const s of [0.5, 1, 1.5, 2]) speed.append(new Option(`${s}×`, s));
    speed.value = '1';
    const total = (v.frameCount / v.fps).toFixed(1);
    const sync = () => {
        btn.textContent = player.playing ? '⏸' : '▶';
        btn.setAttribute('aria-label', t(player.playing ? 'player.pause' : 'player.play'));
    };
    player.onFrame = (i) => {
        range.value = i;
        time.textContent = t('player.time', { t: (i / v.fps).toFixed(1), total });
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

function updateInfoLine() {
    const m = state.meta;
    const parts = [t('info.line', {
        frames: m.frame_count, fps: m.fps, secs: (m.frame_count / m.fps).toFixed(1), w: m.width, h: m.height,
        colors: m.palette.length, sw: m.source.width, sh: m.source.height,
    })];
    if (m.pixel_size !== m.params.pixel_size) parts.push(t('info.auto_pixel', { ps: m.pixel_size }));
    if (m.truncated) parts.push(t('info.truncated', { frames: m.frame_count }));
    $('infoLine').textContent = parts.join(' · ');
}

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
    updateInfoLine();
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

function exportRenderer(maxWidth = Infinity) {
    const width = Math.min(maxWidth, Number($('exportSize').value));
    const canvas = document.createElement('canvas');
    const renderer = new Renderer(canvas, state.video);
    let [w, h] = renderer.fitSize(width, width * 4);
    w -= w % 2;
    h -= h % 2; // video kodlayıcılar çift boyut ister
    renderer.setSize(w, h);
    const style = currentStyle();
    if (style.mode !== 'pixel') {
        const theme = THEMES[$('themeSelect').value];
        style.background = { start: theme.start, end: theme.end };
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
        if (isAbort(e)) toast(t('toast.export_cancelled'));
        else toast(t('toast.export_failed', { msg: errorText(e) }), 'error', 8000);
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
        // GIF sıkıştırması zayıf: büyük boyut + uzun video yüzlerce MB eder
        const gifMax = 720;
        if (Number($('exportSize').value) > gifMax) toast(t('toast.gif_capped', { px: gifMax }));
        return runExport(t('export.making_gif'), async (progress, signal) => {
            const renderer = exportRenderer(gifMax);
            const blob = await encodeGif({ renderer, frameCount: v.frameCount, fps: v.fps, onProgress: progress, signal });
            downloadBlob(blob, `${base}.gif`);
            toast(t('toast.gif_ready', { mb: (blob.size / 1e6).toFixed(1) }), 'success');
        });
    }
    const chosen = supportedVideoFormat(format);
    if (!chosen) {
        toast(t('export.no_recorder'), 'error');
        return;
    }
    if (chosen.format !== format) toast(t('toast.format_fallback', { from: format.toUpperCase(), to: chosen.format.toUpperCase() }));
    return runExport(t('export.recording'), async (progress, signal) => {
        const renderer = exportRenderer();
        const { blob, ext } = await recordVideo({ renderer, frameCount: v.frameCount, fps: v.fps, format, onProgress: progress, signal });
        downloadBlob(blob, `${base}.${ext}`);
        toast(t('toast.video_ready', { mb: (blob.size / 1e6).toFixed(1) }), 'success');
    });
}

async function standaloneBlob() {
    const html = await buildStandaloneHtml({
        video: state.video,
        style: currentStyle(),
        theme: THEMES[$('themeSelect').value],
        message: $('messageText').value,
        typewriter: $('typewriter').checked,
        title: $('pageTitle').value || t('page.default_title'),
        lang: language(),
        rtl: isRtl(),
        strings: { loading: t('page.loading'), hint: t('page.hint'), error: t('page.error') },
    });
    return new Blob([html], { type: 'text/html' });
}

function saveSite() {
    return runExport(t('export.preparing_page'), async () => {
        const blob = await standaloneBlob();
        downloadBlob(blob, 'pixel_art_mesaj.html');
        toast(t('toast.page_saved', { kb: (blob.size / 1024).toFixed(0) }), 'success');
    });
}

function share() {
    return runExport(t('export.preparing_share'), async () => {
        const blob = await standaloneBlob();
        const result = await shareOrDownload(blob, 'pixel_art_mesaj.html', $('messageText').value);
        if (result === 'downloaded') {
            toast(t('toast.share_fallback'), 'info', 8000);
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
    await setLanguage(detectLanguage(storage.get('lang', null)));
    fillSelect($('langSelect'), LANGUAGES, language());
    $('langSelect').addEventListener('change', (e) => changeLanguage(e.target.value));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    fillLocalizedSelects();
    fillSelect($('themeSelect'), Object.entries(THEMES).map(([k, th]) => [k, `${th.emoji} ${t(`theme.${k}`)}`]), storage.get('theme', 'romantic'));
    fillSelect($('bgSelect'), Object.entries(BACKGROUNDS).map(([k, b]) => [k, `${b.emoji} ${t(`bg.${k}`)}`]), storage.get('bg', reduced ? 'none' : 'hearts'));
    applyTheme($('themeSelect').value);
    applyBackground($('bgSelect').value);
    $('themeSelect').addEventListener('change', (e) => applyTheme(e.target.value));
    $('bgSelect').addEventListener('change', (e) => applyBackground(e.target.value));

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
        toast(t('toast.server_unreachable', { msg: errorText(e) }), 'error', 15000);
        return;
    }
    $('formatHint').textContent = t('upload.formats', {
        formats: state.config.extensions.map((e) => e.toUpperCase()).join(', '),
        mb: state.config.max_upload_mb,
    });
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
