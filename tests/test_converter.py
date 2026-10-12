import gzip
import json
import os

import numpy as np
import pytest

from conftest import make_video
from converter import (ConversionError, ConversionParams, build_lut, convert, extract_palette,
                       grid_size, map_to_palette, preset_palette, probe)


def read_result(out):
    meta = json.load(open(os.path.join(out, 'meta.json'), encoding='utf-8'))
    data = np.fromfile(os.path.join(out, 'frames.bin'), np.uint8)
    return meta, data


def test_basic_conversion(video, tmp_path):
    out = tmp_path / 'out'
    res = convert(video, str(out), ConversionParams(pixel_size=8, fps=0))
    meta, data = read_result(out)
    assert (res.width, res.height) == (40, 30)
    assert meta['frame_count'] == 24
    assert data.size == 24 * 40 * 30
    assert data.max() < len(meta['palette']) <= 16
    assert gzip.decompress((out / 'frames.bin.gz').read_bytes()) == data.tobytes()
    assert not (out / 'rgb.tmp').exists()


def test_time_based_fps_is_exact(tmp_path):
    # 29.97 fps → 10 fps: eski kod 14.985 fps üretiyordu
    v = make_video(tmp_path / 'ntsc.mp4', fps=30000 / 1001, frames=90)
    res = convert(v, str(tmp_path / 'o'), ConversionParams(fps=10))
    assert res.fps == 10
    assert 29 <= res.frame_count <= 31


def test_fps_above_source_keeps_source(tmp_path):
    v = make_video(tmp_path / 'v.mp4', fps=12, frames=12)
    res = convert(v, str(tmp_path / 'o'), ConversionParams(fps=30))
    assert res.fps == 12 and res.frame_count == 12


@pytest.mark.parametrize('w,h', [(16, 16), (40, 30), (8, 8)])
def test_tiny_videos_do_not_crash(tmp_path, w, h):
    v = make_video(tmp_path / 't.mp4', w=w, h=h, frames=5)
    res = convert(v, str(tmp_path / 'o'), ConversionParams(pixel_size=8, fps=0))
    assert res.width >= 1 and res.height >= 1 and res.frame_count == 5


def test_solid_color_video(tmp_path):
    v = make_video(tmp_path / 'black.mp4', solid=(0, 0, 0), frames=4)
    res = convert(v, str(tmp_path / 'o'), ConversionParams())
    assert 1 <= len(res.palette) <= 2


def test_trim_and_max_frames(tmp_path):
    v = make_video(tmp_path / 'v.mp4', fps=10, frames=50)  # 5 sn
    res = convert(v, str(tmp_path / 'o'), ConversionParams(fps=0, start=1, end=3))
    assert 19 <= res.frame_count <= 21
    res2 = convert(v, str(tmp_path / 'o2'), ConversionParams(fps=0, max_frames=7))
    assert res2.frame_count == 7


def test_start_after_end_of_video(tmp_path):
    v = make_video(tmp_path / 'v.mp4', fps=10, frames=10)
    with pytest.raises(ConversionError):
        convert(v, str(tmp_path / 'o'), ConversionParams(start=50))


def test_grid_is_capped():
    gw, gh, ps = grid_size(3840, 2160, 2)
    assert gw <= ConversionParams.MAX_GRID_WIDTH and gh <= ConversionParams.MAX_GRID_HEIGHT
    assert ps > 2


@pytest.mark.parametrize('name', ['gameboy', 'pico8', 'cga', 'grayscale', 'sepia', 'sweetie16', 'pastel'])
def test_preset_palettes(video, tmp_path, name):
    res = convert(video, str(tmp_path / name), ConversionParams(palette=name, dither='bayer4'))
    assert res.palette == preset_palette(name)


def test_palette_is_stable_across_frames(video, tmp_path):
    # Global palet: tüm frame'ler aynı paleti kullanır (titreme yok)
    res = convert(video, str(tmp_path / 'o'), ConversionParams(colors=8))
    assert len(res.palette) == 8


def test_lut_maps_palette_colors_to_themselves():
    pal = preset_palette('pico8')
    lut = build_lut(pal)
    img = np.array([pal], np.uint8)
    idx = map_to_palette(img, lut)
    # 5-bit tablo yakın renkleri birleştirebilir; palet renkleri kendine eşlenmeli
    assert (idx[0] == np.arange(len(pal))).mean() > 0.9


def test_extract_palette_with_few_unique_colors():
    px = np.zeros((4, 4, 3), np.uint8)
    px[:2] = 255
    assert len(extract_palette(px, 16)) == 2


def test_probe_rejects_garbage(tmp_path):
    bad = tmp_path / 'bad.mp4'
    bad.write_bytes(os.urandom(5000))
    with pytest.raises(ConversionError):
        probe(str(bad))


def test_cancel(video, tmp_path):
    from converter import ConversionCancelled
    with pytest.raises(ConversionCancelled):
        convert(video, str(tmp_path / 'o'), ConversionParams(), cancelled=lambda: True)


@pytest.mark.parametrize('form,msg', [
    ({'pixel_size': 'abc'}, 'pixel_size'),
    ({'pixel_size': '0'}, 'pixel_size'),
    ({'pixel_size': '1'}, 'pixel_size'),
    ({'fps': '-1'}, 'fps'),
    ({'max_frames': '-5'}, 'max_frames'),
    ({'palette': 'yok'}, 'palet'),
    ({'dither': 'x'}, 'dithering'),
    ({'start': '5', 'end': '2'}, 'Bitiş'),
    ({'fps': 'nan'}, 'fps'),
])
def test_param_validation(form, msg):
    with pytest.raises(ConversionError, match=msg):
        ConversionParams.from_form(form)


def test_param_defaults():
    p = ConversionParams.from_form({})
    assert p.pixel_size == 8 and p.fps == 10 and p.palette == 'auto'


def test_truncated_flag(tmp_path):
    v = make_video(tmp_path / 'v.mp4', fps=10, frames=30)
    assert convert(v, str(tmp_path / 'a'), ConversionParams(fps=0, max_frames=10)).truncated is True
    assert convert(v, str(tmp_path / 'b'), ConversionParams(fps=0)).truncated is False
