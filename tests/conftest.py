import os
import sys
import time

import cv2
import numpy as np
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def make_video(path, w=320, h=240, frames=24, fps=24, fourcc='mp4v', solid=None):
    vw = cv2.VideoWriter(str(path), cv2.VideoWriter_fourcc(*fourcc), fps, (w, h))
    assert vw.isOpened(), f'VideoWriter açılamadı: {path}'
    for i in range(frames):
        if solid is not None:
            f = np.full((h, w, 3), solid, np.uint8)
        else:
            f = np.zeros((h, w, 3), np.uint8)
            f[..., 0] = np.linspace(0, 255, w, dtype=np.uint8)[None, :]
            f[..., 1] = (i * 9) % 256
            cv2.circle(f, ((i * 11) % w, h // 2), max(2, h // 5), (0, 0, 255), -1)
        vw.write(f)
    vw.release()
    return str(path)


@pytest.fixture
def video(tmp_path):
    return make_video(tmp_path / 'clip.mp4')


@pytest.fixture
def app(tmp_path):
    from app import create_app
    application = create_app(data_dir=tmp_path / 'data', workers=1)
    application.config['TESTING'] = True
    return application


@pytest.fixture
def client(app):
    return app.test_client()


def wait_job(client, job_id, timeout=60):
    end = time.time() + timeout
    while time.time() < end:
        data = client.get(f'/api/jobs/{job_id}').get_json()
        if data['state'] in ('done', 'error', 'cancelled'):
            return data
        time.sleep(0.05)
    raise AssertionError('İş zaman aşımına uğradı')
