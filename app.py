"""
Pixel Art Video — Flask uygulaması.

API:
    POST   /api/uploads                 video yükle → {upload_id, info}
    POST   /api/jobs                    {upload_id, ...parametreler} → 202 {job}
    GET    /api/jobs/<id>               iş durumu / ilerleme
    DELETE /api/jobs/<id>               işi iptal et
    GET    /api/jobs/<id>/meta          dönüştürme sonucu (palet, boyutlar, fps)
    GET    /api/jobs/<id>/frames        palet indeksleri (uint8, gzip ile)
    GET    /api/config                  sınırlar, paletler
Tüm hatalar JSON döner: {"error": "..."}
"""

import mimetypes
import os
import sys
from pathlib import Path

from flask import Flask, Response, jsonify, render_template, request, send_file
from werkzeug.exceptions import HTTPException

from converter import PALETTE_LABELS, ConversionError, ConversionParams, preset_palette
from jobs import JobManager, is_valid_id

# Bazı Windows kurulumlarında kayıt defteri .js'i text/plain olarak eşler; modül scriptleri
# o zaman hiç yüklenmez. Türleri sabitle.
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'm4v', '3gp', 'mpg', 'mpeg', 'ts'}
MAX_UPLOAD_MB = 500


def resource_dir():
    """templates/static klasörlerinin bulunduğu yer (exe içinde _MEIPASS)."""
    return Path(getattr(sys, '_MEIPASS', Path(__file__).parent))


def default_data_dir():
    """Çalışma verisi: exe modunda %LOCALAPPDATA%, geliştirmede proje/data."""
    env = os.environ.get('PIXELART_DATA_DIR')
    if env:
        return Path(env)
    if getattr(sys, 'frozen', False):
        base = os.environ.get('LOCALAPPDATA') or str(Path.home())
        return Path(base) / 'PixelArtVideo'
    return Path(__file__).parent / 'data'


def create_app(data_dir=None, workers=2):
    res = resource_dir()
    app = Flask(__name__, template_folder=str(res / 'templates'), static_folder=str(res / 'static'))
    app.config['MAX_CONTENT_LENGTH'] = MAX_UPLOAD_MB * 1024 * 1024
    app.config['JSON_AS_ASCII'] = False
    app.json.ensure_ascii = False
    manager = JobManager(str(data_dir or default_data_dir()), workers=workers)
    app.extensions['jobs'] = manager

    def error(message, status=400, code=None, **params):
        return jsonify({'error': message, 'code': code, 'params': params}), status

    def conversion_error(e, status=400):
        return error(str(e), status, e.code, **e.params)

    @app.errorhandler(HTTPException)
    def http_error(e):
        known = {
            413: ('too_big', f'Dosya çok büyük (en fazla {MAX_UPLOAD_MB} MB)', {'mb': MAX_UPLOAD_MB}),
            404: ('not_found', 'Bulunamadı', {}),
            405: ('method', 'Bu istek türü desteklenmiyor', {}),
        }
        code, message, params = known.get(e.code, ('http', e.description or e.name, {'status': e.code}))
        return error(message, e.code, code, **params)

    @app.errorhandler(Exception)
    def unexpected_error(e):
        app.logger.exception('Beklenmeyen hata')
        return error(f'Sunucu hatası: {e}', 500, 'server', msg=str(e))

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.get('/api/config')
    def config():
        return jsonify({
            'max_upload_mb': MAX_UPLOAD_MB,
            'max_frames': ConversionParams.MAX_FRAMES,
            'max_grid': [ConversionParams.MAX_GRID_WIDTH, ConversionParams.MAX_GRID_HEIGHT],
            'extensions': sorted(ALLOWED_EXTENSIONS),
            'palettes': [{'id': k, 'label': v, 'colors': None if k == 'auto' else preset_palette(k)}
                         for k, v in PALETTE_LABELS.items()],
        })

    @app.post('/api/uploads')
    def upload():
        file = request.files.get('video')
        if file is None or not file.filename:
            return error('Video dosyası seçilmedi', 400, 'no_file')
        ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
        if ext not in ALLOWED_EXTENSIONS:
            supported = ', '.join(sorted(ALLOWED_EXTENSIONS))
            return error(f'Desteklenmeyen dosya türü: .{ext or "?"} (desteklenenler: {supported})', 400,
                         'bad_ext', ext=ext or '?', list=supported)
        try:
            data = manager.save_upload(file, ext)
        except ConversionError as e:
            return conversion_error(e, 422)
        return jsonify(data), 201

    @app.post('/api/jobs')
    def create_job():
        data = request.get_json(silent=True)
        form = data if isinstance(data, dict) else request.form
        upload_id = form.get('upload_id', '')
        if not is_valid_id(upload_id):
            return error('Geçersiz upload_id', 400, 'bad_upload_id')
        try:
            params = ConversionParams.from_form(form)
            job = manager.submit(upload_id, params)
        except ConversionError as e:
            return conversion_error(e)
        return jsonify(job.to_dict()), 202

    def find_job(job_id):
        job = manager.get(job_id) if is_valid_id(job_id) else None
        return job

    @app.get('/api/jobs/<job_id>')
    def job_status(job_id):
        job = find_job(job_id)
        return jsonify(job.to_dict()) if job else error('İş bulunamadı', 404, 'job_not_found')

    @app.delete('/api/jobs/<job_id>')
    def job_cancel(job_id):
        job = manager.cancel(job_id) if is_valid_id(job_id) else None
        return jsonify(job.to_dict()) if job else error('İş bulunamadı', 404, 'job_not_found')

    def finished_file(job_id, name):
        job = find_job(job_id)
        if not job:
            return None, error('İş bulunamadı', 404, 'job_not_found')
        if job.state != 'done':
            return None, error('İş henüz tamamlanmadı', 409, 'not_done')
        path = os.path.join(manager.job_dir(job_id), name)
        if not os.path.exists(path):
            return None, error('Sonuç dosyası bulunamadı (süresi dolmuş olabilir)', 410, 'result_gone')
        return path, None

    @app.get('/api/jobs/<job_id>/meta')
    def job_meta(job_id):
        path, err = finished_file(job_id, 'meta.json')
        return err or send_file(path, mimetype='application/json', max_age=0)

    @app.get('/api/jobs/<job_id>/frames')
    def job_frames(job_id):
        path, err = finished_file(job_id, 'frames.bin')
        if err:
            return err
        gz = path + '.gz'
        if 'gzip' in request.headers.get('Accept-Encoding', '') and os.path.exists(gz):
            with open(gz, 'rb') as f:
                body = f.read()
            resp = Response(body, mimetype='application/octet-stream')
            resp.headers['Content-Encoding'] = 'gzip'
            resp.headers['Vary'] = 'Accept-Encoding'
            return resp
        return send_file(path, mimetype='application/octet-stream', max_age=0)

    return app


if __name__ == '__main__':
    # Geliştirme: yalnızca bu bilgisayardan erişilebilir. Debug için FLASK_DEBUG=1
    debug = os.environ.get('FLASK_DEBUG') == '1'
    create_app().run(host='127.0.0.1', port=int(os.environ.get('PORT', 5000)), debug=debug, threaded=True)
