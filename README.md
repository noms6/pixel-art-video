<div align="center">

<img src="static/favicon.png" width="72" alt="">

# Pixel Art Video

**Turn any video into pixel art, flower mosaics or ASCII art, add a personal message and share it.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

🌐 **English** · [Türkçe](docs/readme/README.tr.md) · [Deutsch](docs/readme/README.de.md) · [Français](docs/readme/README.fr.md) · [Español](docs/readme/README.es.md) · [Italiano](docs/readme/README.it.md) · [Português](docs/readme/README.pt.md) · [Nederlands](docs/readme/README.nl.md) · [Polski](docs/readme/README.pl.md) · [Română](docs/readme/README.ro.md) · [Svenska](docs/readme/README.sv.md) · [Ελληνικά](docs/readme/README.el.md) · [Русский](docs/readme/README.ru.md) · [Українська](docs/readme/README.uk.md) · [Azərbaycanca](docs/readme/README.az.md) · [العربية](docs/readme/README.ar.md) · [فارسی](docs/readme/README.fa.md) · [हिन्दी](docs/readme/README.hi.md) · [日本語](docs/readme/README.ja.md) · [한국어](docs/readme/README.ko.md) · [中文](docs/readme/README.zh.md) · [Bahasa Indonesia](docs/readme/README.id.md) · [Tiếng Việt](docs/readme/README.vi.md) · [ไทย](docs/readme/README.th.md)

<img src="docs/images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="docs/images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

## ✨ Features

- Fast: a 1-minute 1080p video converts in about 7 seconds
- Every common format: MP4, MOV, WebM, AVI, MKV, WMV, FLV and more (up to 500 MB)
- 28 styles: plain pixel art, flowers, hearts, shapes, LED, ASCII and Braille
- Palettes (auto, Game Boy, PICO-8, CGA, sepia…), dithering, brightness/contrast, trimming
- Export as MP4/WebM video at the original speed or as an endlessly looping GIF
- Save a single-file web page with your message and a typewriter effect (100–500 KB, works offline)
- Available in 24 languages, chosen automatically from your browser
- Runs entirely on your computer — your videos are never uploaded anywhere

## 📥 Download (Windows)

1. Download `PixelArtVideo-Windows-x64.zip` from the [latest release](https://github.com/noms6/pixel-art-video/releases/latest).
2. Extract it and run `VideoASCIIArtConverter.exe` — your browser opens automatically. No Python needed.

> If Windows SmartScreen warns you, click **More info → Run anyway** (the app is not code-signed).

## 🖼️ Screenshots

| | |
|---|---|
| <img src="docs/images/upload.png" alt=""><br>Upload a video | <img src="docs/images/preview.png" alt=""><br>Original and pixel art side by side |
| <img src="docs/images/result.png" alt=""><br>Pick a style and write your message | <img src="docs/images/mobile-rtl.png" width="260" alt=""><br>Mobile, right-to-left languages |

## 🎨 Styles

| | | |
|---|---|---|
| <img src="docs/images/style-pixel.png" alt=""><br>Pixel art | <img src="docs/images/style-rose.png" alt=""><br>Roses | <img src="docs/images/style-heart.png" alt=""><br>Hearts |
| <img src="docs/images/style-ascii.png" alt=""><br>ASCII | <img src="docs/images/style-braille.png" alt=""><br>Braille | <img src="docs/images/style-led.png" alt=""><br>LED screen |

## 🧭 How to use

1. Upload a video (drag & drop or choose a file). Optionally open the conversion settings first.
2. Check the preview. Change the settings and convert again without re-uploading.
3. Press ✨ START ✨, pick a style and adjust size, density and colors.
4. Write your message, then download a video or GIF, save the page or share it.

## Development

### Run from source

```bash
pip install -r requirements.txt
python start_app.py
```

The browser opens automatically. If port 5000 is busy the next free port is used.

| Environment variable | Meaning |
|---|---|
| `PORT` | Preferred port (default 5000) |
| `PIXELART_NO_BROWSER=1` | Don't open the browser |
| `PIXELART_DATA_DIR` | Working-data folder (default: `%LOCALAPPDATA%\PixelArtVideo` for the exe, `data/` from source; files older than 24 h are removed automatically) |
| `FLASK_DEBUG=1` | Debug mode for `python app.py` (bound to 127.0.0.1 only) |

### Build the Windows app

```bash
build.bat
```

Output: `dist\VideoASCIIArtConverter\VideoASCIIArtConverter.exe` (keep the whole folder together).
`python build_exe.py --onefile` builds a single exe instead (slower start-up).
Publishing a GitHub Release builds the exe automatically and attaches the zip (`.github/workflows/release.yml`).

### Architecture

```
start_app.py      launcher: package check, free port, waitress server, opens the browser
app.py            Flask API (/api/uploads, /api/jobs, /api/config) — every error is JSON with a code
jobs.py           background job queue, progress, cancellation, 24 h clean-up
converter.py      video → palette indices (time-based fps, global palette, 32³ colour lookup table)
static/js/
  main.js         UI flow and state
  api.js          server client (upload progress, job polling)
  renderer.js     canvas renderer + player (also embedded in saved pages)
  shapes.js       shapes, ASCII sets, themes, backgrounds
  export.js       video recording, GIF encoder, single-file page
  i18n.js         language selection (static/i18n/<lang>.json)
legacy/           original terminal ASCII scripts
tests/            pytest suite
tools/            README generator
```

Each conversion produces `meta.json` (size, fps, palette) and `frames.bin` (frame × height × width `uint8`
palette indices, served gzip-compressed) — about 80 KB for an 8-second 720p clip.

### Tests

```bash
pip install -r requirements-dev.txt
python -m pytest
```

Covers the converter (fps, trimming, tiny/solid videos, palettes, validation, cancellation), the API (full flow,
JSON errors, 413, concurrent uploads, TTL clean-up), every translation file, and a pixel-exact check of the GIF
encoder against Pillow (needs Node.js).

### Translations

UI strings live in `static/i18n/<lang>.json`. To add a language, copy `en.json`, translate it and add the code to
`LANGUAGES` in `static/js/i18n.js`; `tests/test_i18n.py` reports missing keys or mismatched `{placeholders}`.
README texts are generated by `python tools/make_readmes.py`.


## 📜 License

[MIT](LICENSE) © noms6

The Windows build bundles these open-source components: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
