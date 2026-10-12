// Sunucu API istemcisi. Hatalar ApiError olarak fırlatılır: code + params arayüzde çevrilir
// (i18n.errorText), message sunucunun yedek metnidir.

export class ApiError extends Error {
    constructor(code, params = {}, message = '') {
        super(message || code);
        this.code = code;
        this.params = params;
    }
}

async function parse(response) {
    let data = null;
    try {
        data = await response.json();
    } catch {
        // JSON olmayan yanıt
    }
    if (!response.ok) {
        if (data && data.code) throw new ApiError(data.code, data.params || {}, data.error);
        throw new ApiError('http', { status: response.status }, data && data.error);
    }
    return data;
}

export async function getConfig() {
    return parse(await fetch('/api/config'));
}

// fetch yükleme ilerlemesi veremediği için XHR kullanılır.
export function uploadVideo(file, onProgress, signal) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/uploads');
        xhr.responseType = 'json';
        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress && onProgress(e.loaded / e.total);
        xhr.onload = () => {
            const data = xhr.response;
            if (xhr.status >= 200 && xhr.status < 300) resolve(data);
            else if (data && data.code) reject(new ApiError(data.code, data.params || {}, data.error));
            else reject(new ApiError('upload_failed', { status: xhr.status }));
        };
        xhr.onerror = () => reject(new ApiError('unreachable'));
        xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'));
        if (signal) signal.addEventListener('abort', () => xhr.abort(), { once: true });
        const form = new FormData();
        form.append('video', file);
        xhr.send(form);
    });
}

export async function createJob(uploadId, params) {
    return parse(await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upload_id: uploadId, ...params }),
    }));
}

export async function cancelJob(jobId) {
    try {
        await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    } catch {
        // iptal en iyi çaba ile yapılır
    }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// İş bitene kadar durumu sorgula; bitince {meta, frames} döndür.
// onProgress(oran, aşama_kodu, aşama_parametreleri)
export async function waitForJob(jobId, onProgress, signal) {
    let delay = 150;
    // İptal edilince sunucudaki işi de hemen durdur (sorgu beklenmeden)
    if (signal) signal.addEventListener('abort', () => cancelJob(jobId), { once: true });
    for (;;) {
        if (signal && signal.aborted) throw new DOMException('Aborted', 'AbortError');
        const job = await parse(await fetch(`/api/jobs/${jobId}`, { signal }));
        if (onProgress) onProgress(job.progress, job.stage_code, job.stage_params || {});
        if (job.state === 'done') break;
        if (job.state === 'error') throw new ApiError(job.error_code || 'unexpected', job.error_params || {}, job.error);
        if (job.state === 'cancelled') throw new DOMException('Aborted', 'AbortError');
        await sleep(delay);
        delay = Math.min(600, delay * 1.3);
    }
    const [meta, buffer] = await Promise.all([
        parse(await fetch(`/api/jobs/${jobId}/meta`, { signal })),
        fetch(`/api/jobs/${jobId}/frames`, { signal }).then((r) => {
            if (!r.ok) throw new ApiError('frames_failed');
            return r.arrayBuffer();
        }),
    ]);
    const frames = new Uint8Array(buffer);
    if (frames.length !== meta.frame_count * meta.width * meta.height) throw new ApiError('frames_incomplete');
    return { meta, frames };
}
