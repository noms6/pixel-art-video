"""Çeviri dosyalarının eksiksiz ve tutarlı olduğunu doğrular."""

import glob
import json
import os
import re

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
I18N = os.path.join(ROOT, 'static', 'i18n')
PLACEHOLDER = re.compile(r'\{(\w+)\}')


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def load(code):
    return json.loads(read(os.path.join(I18N, f'{code}.json')))


def language_codes():
    src = read(os.path.join(ROOT, 'static', 'js', 'i18n.js'))
    return re.findall(r"\['([a-z]{2})', '", src)


EN = load('en')


def test_at_least_20_languages_and_files_match_list():
    codes = language_codes()
    assert len(codes) >= 20
    files = {os.path.basename(p)[:-5] for p in glob.glob(os.path.join(I18N, '*.json'))}
    assert files == set(codes)


@pytest.mark.parametrize('code', language_codes())
def test_language_complete_and_consistent(code):
    data = load(code)
    assert set(data) == set(EN), f'{code}: eksik {sorted(set(EN) - set(data))}, fazla {sorted(set(data) - set(EN))}'
    for key, text in data.items():
        assert isinstance(text, str) and text.strip(), f'{code}:{key} boş'
        assert set(PLACEHOLDER.findall(text)) == set(PLACEHOLDER.findall(EN[key])), f'{code}:{key} parametreler farklı'


def required_keys():
    keys = set()
    for path in glob.glob(os.path.join(ROOT, 'static', 'js', '*.js')):
        keys |= set(re.findall(r"""\bt\(\s*'([a-z0-9_.]+)'""", read(path)))
    keys |= set(re.findall(r'data-i18n(?:-placeholder|-aria)?="([a-z0-9_.]+)"', read(os.path.join(ROOT, 'templates', 'index.html'))))
    shapes = read(os.path.join(ROOT, 'static', 'js', 'shapes.js'))

    def ids(block):
        body = shapes.split(f'export const {block} = {{', 1)[1].split('\n};', 1)[0]
        return re.findall(r'^\s{4}(\w+): \{', body, re.M)

    keys |= {f'shape.{i}' for i in ids('SHAPES')}
    keys |= {f'ascii.{i}' for i in ids('ASCII_SETS')}
    keys |= {f'theme.{i}' for i in ids('THEMES')}
    keys |= {f'bg.{i}' for i in ids('BACKGROUNDS')}

    from converter import PALETTE_LABELS
    from jobs import STAGE_TEXT
    keys |= {f'palette.{p}' for p in PALETTE_LABELS}
    keys |= {f'stage.{s}' for s in STAGE_TEXT}
    backend = read(os.path.join(ROOT, 'converter.py')) + read(os.path.join(ROOT, 'jobs.py')) + read(os.path.join(ROOT, 'app.py'))
    codes = set(re.findall(r"ConversionError\(\s*'(\w+)'", backend))
    codes |= set(re.findall(r"error\([^)]*?, \d{3}, '(\w+)'", backend, re.S))
    codes |= set(re.findall(r"\d{3}: \('(\w+)'", backend))
    codes |= {'http', 'unreachable', 'upload_failed', 'frames_failed', 'frames_incomplete'}  # api.js
    keys |= {f'err.{c}' for c in codes}
    return keys


def test_every_used_key_is_translated():
    missing = sorted(k for k in required_keys() if k not in EN)
    assert not missing, f'en.json içinde eksik: {missing}'
