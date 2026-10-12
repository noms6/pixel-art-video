<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Gör om vilken video som helst till pixelkonst, blommosaik eller ASCII-konst, lägg till ett personligt meddelande och dela den.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · **Svenska** · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

## ✨ Funktioner

- Snabbt: en minutlång 1080p-video konverteras på ungefär 7 sekunder
- Alla vanliga format: MP4, MOV, WebM, AVI, MKV, WMV, FLV med flera (upp till 500 MB)
- 28 stilar: enkel pixelkonst, blommor, hjärtan, former, LED, ASCII och punktskrift
- Paletter (automatisk, Game Boy, PICO-8, CGA, sepia…), dithering, ljusstyrka/kontrast, beskärning
- Exportera som MP4/WebM-video i originalhastighet eller som en GIF som loopar i oändlighet
- Spara en webbsida i en enda fil med ditt meddelande och skrivmaskinseffekt (100–500 KB, fungerar offline)
- Finns på 24 språk, väljs automatiskt efter webbläsaren
- Körs helt på din dator — dina videor laddas aldrig upp någonstans

## 📥 Ladda ner (Windows)

1. Ladda ner `PixelArtVideo-Windows-x64.zip` från [senaste versionen](https://github.com/noms6/pixel-art-video/releases/latest).
2. Packa upp och kör `VideoASCIIArtConverter.exe` — webbläsaren öppnas automatiskt. Python behövs inte.

> Om Windows SmartScreen varnar, klicka på **Mer information → Kör ändå** (appen är inte signerad).

## 🖼️ Skärmbilder

| | |
|---|---|
| <img src="../images/upload.png" alt=""><br>Ladda upp en video | <img src="../images/preview.png" alt=""><br>Original och pixelkonst sida vid sida |
| <img src="../images/result.png" alt=""><br>Välj en stil och skriv ditt meddelande | <img src="../images/mobile-rtl.png" width="260" alt=""><br>Mobil, språk som skrivs från höger till vänster |

## 🎨 Stilar

| | | |
|---|---|---|
| <img src="../images/style-pixel.png" alt=""><br>Pixelkonst | <img src="../images/style-rose.png" alt=""><br>Rosor | <img src="../images/style-heart.png" alt=""><br>Hjärtan |
| <img src="../images/style-ascii.png" alt=""><br>ASCII | <img src="../images/style-braille.png" alt=""><br>Punktskrift | <img src="../images/style-led.png" alt=""><br>LED-skärm |

## 🧭 Så använder du den

1. Ladda upp en video (dra och släpp eller välj en fil). Öppna gärna konverteringsinställningarna först.
2. Kontrollera förhandsvisningen. Ändra inställningarna och konvertera igen utan att ladda upp på nytt.
3. Tryck på ✨ START ✨, välj en stil och justera storlek, täthet och färger.
4. Skriv ditt meddelande och ladda ner en video eller GIF, spara sidan eller dela den.

## 🚀 Köra från källkoden

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Utveckling

Arkitektur, API, tester och översättningsguide: se [huvud-README](../../README.md#development).

## 📜 Licens

[MIT](../../LICENSE) © noms6

Windows-versionen innehåller dessa komponenter med öppen källkod: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
