"""
Arka plan dönüştürme işleri: yükleme kaydı, iş kuyruğu, ilerleme, iptal ve TTL temizliği.

Klasör yapısı (data_dir altında):
    uploads/<upload_id>/source.<ext>   + info.json
    jobs/<job_id>/meta.json, frames.bin, frames.bin.gz
"""

import json
import os
import shutil
import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from dataclasses import asdict

from converter import ConversionCancelled, ConversionError, convert, probe


def new_id():
    return uuid.uuid4().hex[:16]


def is_valid_id(value):
    return isinstance(value, str) and len(value) == 16 and all(c in '0123456789abcdef' for c in value)


class Job:
    def __init__(self, job_id, upload_id, params):
        self.id = job_id
        self.upload_id = upload_id
        self.params = params
        self.state = 'queued'        # queued | running | done | error | cancelled
        self.progress = 0.0
        self.stage = 'Sırada bekliyor…'
        self.error = None
        self.created = time.time()
        self.cancel_event = threading.Event()

    def to_dict(self):
        return {'id': self.id, 'upload_id': self.upload_id, 'state': self.state,
                'progress': round(self.progress, 3), 'stage': self.stage, 'error': self.error}


class JobManager:
    def __init__(self, data_dir, workers=2, ttl_seconds=24 * 3600):
        self.data_dir = data_dir
        self.uploads_dir = os.path.join(data_dir, 'uploads')
        self.jobs_dir = os.path.join(data_dir, 'jobs')
        os.makedirs(self.uploads_dir, exist_ok=True)
        os.makedirs(self.jobs_dir, exist_ok=True)
        self.ttl = ttl_seconds
        self.jobs = {}
        self.lock = threading.Lock()
        self.pool = ThreadPoolExecutor(max_workers=workers, thread_name_prefix='convert')
        self._start_cleanup_thread()

    # ---------- yüklemeler ----------
    def save_upload(self, file_storage, ext):
        upload_id = new_id()
        folder = os.path.join(self.uploads_dir, upload_id)
        os.makedirs(folder)
        path = os.path.join(folder, f'source.{ext}')
        file_storage.save(path)
        try:
            info = probe(path)
        except ConversionError:
            shutil.rmtree(folder, ignore_errors=True)
            raise
        data = {'upload_id': upload_id, 'ext': ext, 'original_name': file_storage.filename or '',
                'info': asdict(info)}
        with open(os.path.join(folder, 'info.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)
        return data

    def upload_path(self, upload_id):
        folder = os.path.join(self.uploads_dir, upload_id)
        try:
            with open(os.path.join(folder, 'info.json'), encoding='utf-8') as f:
                ext = json.load(f)['ext']
        except (OSError, ValueError, KeyError):
            return None
        path = os.path.join(folder, f'source.{ext}')
        return path if os.path.exists(path) else None

    # ---------- işler ----------
    def submit(self, upload_id, params):
        source = self.upload_path(upload_id)
        if not source:
            raise ConversionError('Yüklenen video bulunamadı (süresi dolmuş olabilir), lütfen tekrar yükleyin')
        job = Job(new_id(), upload_id, params)
        with self.lock:
            self.jobs[job.id] = job
        self.pool.submit(self._run, job, source)
        return job

    def get(self, job_id):
        with self.lock:
            return self.jobs.get(job_id)

    def cancel(self, job_id):
        job = self.get(job_id)
        if job and job.state in ('queued', 'running'):
            job.cancel_event.set()
            if job.state == 'queued':
                job.state, job.stage = 'cancelled', 'İptal edildi'
        return job

    def job_dir(self, job_id):
        return os.path.join(self.jobs_dir, job_id)

    def _run(self, job, source):
        if job.cancel_event.is_set():
            return
        job.state, job.stage = 'running', 'Başlatılıyor…'
        out_dir = self.job_dir(job.id)

        def on_progress(value, stage):
            job.progress, job.stage = value, stage

        try:
            convert(source, out_dir, job.params, progress=on_progress, cancelled=job.cancel_event.is_set)
            job.state, job.progress, job.stage = 'done', 1.0, 'Tamamlandı'
        except ConversionCancelled:
            job.state, job.stage = 'cancelled', 'İptal edildi'
            shutil.rmtree(out_dir, ignore_errors=True)
        except ConversionError as e:
            job.state, job.error, job.stage = 'error', str(e), 'Hata'
            shutil.rmtree(out_dir, ignore_errors=True)
        except Exception as e:  # beklenmeyen hata: kullanıcıya kısa mesaj, konsola ayrıntı
            import traceback
            traceback.print_exc()
            job.state, job.error, job.stage = 'error', f'Beklenmeyen hata: {e}', 'Hata'
            shutil.rmtree(out_dir, ignore_errors=True)

    # ---------- temizlik ----------
    def cleanup(self, now=None):
        """TTL'den eski yükleme ve iş klasörlerini sil. Silinen klasör sayısını döndürür."""
        now = now or time.time()
        removed = 0
        with self.lock:
            running = [j for j in self.jobs.values() if j.state in ('queued', 'running')]
        active = {j.id for j in running}
        active_uploads = {j.upload_id for j in running}
        for base, keep in ((self.jobs_dir, active), (self.uploads_dir, active_uploads)):
            for name in os.listdir(base):
                path = os.path.join(base, name)
                if name in keep or not os.path.isdir(path):
                    continue
                if now - os.path.getmtime(path) > self.ttl:
                    shutil.rmtree(path, ignore_errors=True)
                    removed += 1
        with self.lock:
            for job_id in [k for k, j in self.jobs.items() if now - j.created > self.ttl and k not in active]:
                del self.jobs[job_id]
        return removed

    def _start_cleanup_thread(self):
        def loop():
            while True:
                try:
                    self.cleanup()
                except Exception:
                    pass
                time.sleep(600)
        threading.Thread(target=loop, daemon=True, name='cleanup').start()
