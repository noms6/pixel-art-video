<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Transformă orice videoclip în pixel art, mozaic de flori sau artă ASCII, adaugă un mesaj personal și distribuie-l.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · **Română** · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="400" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="400" alt="ASCII demo">

</div>

## ✨ Funcții

- Rapid: un videoclip 1080p de un minut se convertește în aproximativ 7 secunde
- Toate formatele uzuale: MP4, MOV, WebM, AVI, MKV, WMV, FLV și altele (până la 500 MB)
- 28 de stiluri: pixel art simplu, flori, inimi, forme, LED, ASCII și Braille
- Palete (automată, Game Boy, PICO-8, CGA, sepia…), dithering, luminozitate/contrast, tăiere
- Export ca video MP4/WebM la viteza originală sau ca GIF care rulează la nesfârșit
- Salvează o pagină web într-un singur fișier cu mesajul tău și efect de mașină de scris (100–500 KB, offline)
- Disponibil în 24 de limbi, alese automat după browser
- Rulează complet pe calculatorul tău — videoclipurile nu sunt încărcate nicăieri

## 📥 Descărcare (Windows)

1. Descarcă `PixelArtVideo-Windows-x64.zip` din [cea mai nouă versiune](https://github.com/noms6/pixel-art-video/releases/latest).
2. Dezarhivează și rulează `VideoASCIIArtConverter.exe` — browserul se deschide singur. Nu ai nevoie de Python.

> Dacă Windows SmartScreen afișează un avertisment, apasă **Mai multe informații → Rulează oricum** (aplicația nu este semnată).

## 🖼️ Capturi de ecran

<table>
<tr><td align="center"><img src="../images/upload.png" alt=""><br>Încarcă un videoclip</td><td align="center"><img src="../images/preview.png" alt=""><br>Original și pixel art unul lângă altul</td></tr>
<tr><td align="center"><img src="../images/result.png" alt=""><br>Alege un stil și scrie-ți mesajul</td><td align="center"><img src="../images/mobile-rtl.png" width="260" alt=""><br>Mobil, limbi de la dreapta la stânga</td></tr>
</table>

## 🎨 Stiluri

<table>
<tr><td align="center"><img src="../images/style-pixel.png" alt=""><br>Pixel art</td><td align="center"><img src="../images/style-rose.png" alt=""><br>Trandafiri</td><td align="center"><img src="../images/style-heart.png" alt=""><br>Inimi</td></tr>
<tr><td align="center"><img src="../images/style-ascii.png" alt=""><br>ASCII</td><td align="center"><img src="../images/style-braille.png" alt=""><br>Braille</td><td align="center"><img src="../images/style-led.png" alt=""><br>Ecran LED</td></tr>
</table>

## 🧭 Utilizare

1. Încarcă un videoclip (trage și plasează sau alege un fișier). Poți deschide întâi setările de conversie.
2. Verifică previzualizarea. Schimbă setările și convertește din nou fără reîncărcare.
3. Apasă ✨ START ✨, alege un stil și ajustează mărimea, densitatea și culorile.
4. Scrie-ți mesajul, apoi descarcă un video sau un GIF, salvează pagina sau distribuie-o.

## 🚀 Rulare din codul sursă

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Dezvoltare

Arhitectură, API, teste și ghid de traducere: vezi [README-ul principal](../../README.md#development).

## 📜 Licență

[MIT](../../LICENSE) © noms6

Versiunea pentru Windows include aceste componente open source: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
