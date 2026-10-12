import gzip
import io
import os
import threading
import time

import numpy as np

from conftest import make_video, wait_job


def upload(client, path, name=None):
    with open(path, 'rb') as f:
        return client.post('/api/uploads', data={'video': (f, name or os.path.basename(path))},
                           content_type='multipart/form-data')


def test_index_and_config(client):
    assert client.get('/').status_code == 200
    cfg = client.get('/api/config').get_json()
    assert any(p['id'] == 'gameboy' for p in cfg['palettes'])


def test_full_flow(client, video):
    r = upload(client, video)
    assert r.status_code == 201
    up = r.get_json()
    assert up['info']['width'] == 320
    r = client.post('/api/jobs', json={'upload_id': up['upload_id'], 'pixel_size': 8, 'fps': 0})
    assert r.status_code == 202
    job = wait_job(client, r.get_json()['id'])
    assert job['state'] == 'done', job
    meta = client.get(f"/api/jobs/{job['id']}/meta").get_json()
    raw = client.get(f"/api/jobs/{job['id']}/frames", headers={'Accept-Encoding': 'gzip'})
    assert raw.headers['Content-Encoding'] == 'gzip'
    data = gzip.decompress(raw.data)
    assert len(data) == meta['frame_count'] * meta['width'] * meta['height']
    plain = client.get(f"/api/jobs/{job['id']}/frames")
    assert plain.data == data


def test_rerun_with_new_params_reuses_upload(client, video):
    up = upload(client, video).get_json()
    a = wait_job(client, client.post('/api/jobs', json={'upload_id': up['upload_id'], 'pixel_size': 8}).get_json()['id'])
    b = wait_job(client, client.post('/api/jobs', json={'upload_id': up['upload_id'], 'pixel_size': 16}).get_json()['id'])
    ma = client.get(f"/api/jobs/{a['id']}/meta").get_json()
    mb = client.get(f"/api/jobs/{b['id']}/meta").get_json()
    assert (ma['width'], mb['width']) == (40, 20)


def test_all_errors_are_json(client, app, video, tmp_path):
    assert client.post('/api/uploads').get_json()['error']
    bad_ext = client.post('/api/uploads', data={'video': (io.BytesIO(b'x'), 'a.txt')},
                          content_type='multipart/form-data')
    assert bad_ext.status_code == 400 and 'Desteklenmeyen' in bad_ext.get_json()['error']
    garbage = client.post('/api/uploads', data={'video': (io.BytesIO(os.urandom(3000)), 'x.mp4')},
                          content_type='multipart/form-data')
    assert garbage.status_code == 422 and garbage.get_json()['error']
    up = upload(client, video).get_json()
    r = client.post('/api/jobs', json={'upload_id': up['upload_id'], 'pixel_size': 'abc'})
    assert r.status_code == 400 and r.is_json
    assert client.post('/api/jobs', json={'upload_id': '../../etc'}).status_code == 400
    assert client.get('/api/jobs/0123456789abcdef').status_code == 404
    assert client.get('/api/jobs/zz/meta').is_json
    app.config['MAX_CONTENT_LENGTH'] = 1000
    big = upload(client, video)
    assert big.status_code == 413 and big.is_json


def test_meta_before_done_is_409(client, video):
    up = upload(client, video).get_json()
    job = client.post('/api/jobs', json={'upload_id': up['upload_id']}).get_json()
    r = client.get(f"/api/jobs/{job['id']}/meta")
    assert r.status_code in (200, 409)
    wait_job(client, job['id'])


def test_same_filename_concurrent_uploads_do_not_collide(client, tmp_path):
    a = make_video(tmp_path / 'a.mp4', w=320, h=240)
    b = make_video(tmp_path / 'b.mp4', w=240, h=320)
    results = {}

    def go(path, key):
        c = client.application.test_client()
        up = upload(c, path, 'ayni.mp4').get_json()
        job = c.post('/api/jobs', json={'upload_id': up['upload_id']}).get_json()
        done = wait_job(c, job['id'])
        results[key] = (done['state'], c.get(f"/api/jobs/{job['id']}/meta").get_json())

    threads = [threading.Thread(target=go, args=(p, k)) for p, k in ((a, 'a'), (b, 'b'))]
    [t.start() for t in threads]
    [t.join() for t in threads]
    assert results['a'][0] == results['b'][0] == 'done'
    assert results['a'][1]['width'] == 40 and results['b'][1]['width'] == 30


def test_cancel_job(client, tmp_path):
    v = make_video(tmp_path / 'long.mp4', w=640, h=480, frames=240)
    up = upload(client, v).get_json()
    job = client.post('/api/jobs', json={'upload_id': up['upload_id'], 'fps': 0}).get_json()
    client.delete(f"/api/jobs/{job['id']}")
    done = wait_job(client, job['id'])
    assert done['state'] in ('cancelled', 'done')


def test_turkish_and_odd_filenames(client, video):
    for name in ['çiçek_düğün.mp4', 'VIDEO.MP4', '../../x.mp4', 'con.mp4']:
        r = upload(client, video, name)
        assert r.status_code == 201, name


def test_ttl_cleanup(app, client, video):
    mgr = app.extensions['jobs']
    up = upload(client, video).get_json()
    job = wait_job(client, client.post('/api/jobs', json={'upload_id': up['upload_id']}).get_json()['id'])
    assert mgr.cleanup(now=time.time() + 10) == 0
    assert mgr.cleanup(now=time.time() + mgr.ttl + 10) == 2
    assert client.get(f"/api/jobs/{job['id']}").status_code == 404


def test_non_object_json_body_is_400(client):
    r = client.post('/api/jobs', json=['x'])
    assert r.status_code == 400 and r.is_json
