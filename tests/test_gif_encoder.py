"""Tarayıcıdaki GIF kodlayıcısını (static/js/export.js) Node ile çalıştırıp Pillow ile doğrular."""

import json
import os
import shutil
import subprocess

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Image = pytest.importorskip('PIL.Image')
ImageSequence = pytest.importorskip('PIL.ImageSequence')


@pytest.mark.skipif(shutil.which('node') is None, reason='Node.js yok')
def test_gif_encoder_roundtrip(tmp_path):
    subprocess.run(['node', os.path.join(ROOT, 'tests', 'gif_check.mjs'),
                    os.path.join(ROOT, 'static', 'js', 'export.js'), str(tmp_path)], check=True)
    for name in ['pal1', 'pal2', 'pal5', 'pal256']:
        ref = json.loads((tmp_path / f'{name}.json').read_text())
        im = Image.open(tmp_path / f'{name}.gif')
        assert im.info.get('loop') == 0, 'sonsuz döngü olmalı'
        count = 0
        # Iterator her karede aynı nesneyi döndürür; kontrol döngü içinde yapılmalı
        for i, frame in enumerate(ImageSequence.Iterator(im)):
            assert frame.info.get('duration') == (8 + i) * 10
            expected = [tuple(ref['palette'][k]) for k in ref['frames'][i]]
            assert list(frame.convert('RGB').getdata()) == expected, f'{name} frame {i}'
            count += 1
        assert count == len(ref['frames'])
