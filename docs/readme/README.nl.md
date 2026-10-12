<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Maak van elke video pixel-art, een bloemenmozaïek of ASCII-kunst, voeg een persoonlijke boodschap toe en deel hem.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · **Nederlands** · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="400" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="400" alt="ASCII demo">

</div>

## ✨ Functies

- Snel: een 1080p-video van een minuut is in ongeveer 7 seconden omgezet
- Alle gangbare formaten: MP4, MOV, WebM, AVI, MKV, WMV, FLV en meer (tot 500 MB)
- 28 stijlen: gewone pixel-art, bloemen, hartjes, vormen, LED, ASCII en braille
- Paletten (automatisch, Game Boy, PICO-8, CGA, sepia…), dithering, helderheid/contrast, inkorten
- Exporteer als MP4/WebM-video op de originele snelheid of als eindeloos herhalende GIF
- Bewaar een webpagina in één bestand met je boodschap en typemachine-effect (100–500 KB, werkt offline)
- Beschikbaar in 24 talen, automatisch gekozen op basis van je browser
- Draait volledig op je eigen computer — je video’s worden nergens geüpload

## 📥 Downloaden (Windows)

1. Download `PixelArtVideo-Windows-x64.zip` uit de [nieuwste release](https://github.com/noms6/pixel-art-video/releases/latest).
2. Pak het uit en start `VideoASCIIArtConverter.exe` — je browser opent vanzelf. Python is niet nodig.

> Waarschuwt Windows SmartScreen? Klik op **Meer informatie → Toch uitvoeren** (de app is niet ondertekend).

## 🖼️ Schermafbeeldingen

<table>
<tr><td align="center"><img src="../images/upload.png" alt=""><br>Video uploaden</td><td align="center"><img src="../images/preview.png" alt=""><br>Origineel en pixel-art naast elkaar</td></tr>
<tr><td align="center"><img src="../images/result.png" alt=""><br>Kies een stijl en schrijf je boodschap</td><td align="center"><img src="../images/mobile-rtl.png" width="260" alt=""><br>Mobiel, talen van rechts naar links</td></tr>
</table>

## 🎨 Stijlen

<table>
<tr><td align="center"><img src="../images/style-pixel.png" alt=""><br>Pixel-art</td><td align="center"><img src="../images/style-rose.png" alt=""><br>Rozen</td><td align="center"><img src="../images/style-heart.png" alt=""><br>Hartjes</td></tr>
<tr><td align="center"><img src="../images/style-ascii.png" alt=""><br>ASCII</td><td align="center"><img src="../images/style-braille.png" alt=""><br>Braille</td><td align="center"><img src="../images/style-led.png" alt=""><br>LED-scherm</td></tr>
</table>

## 🧭 Gebruik

1. Upload een video (slepen of bestand kiezen). Open eventueel eerst de conversie-instellingen.
2. Bekijk het voorbeeld. Wijzig de instellingen en converteer opnieuw zonder opnieuw te uploaden.
3. Druk op ✨ START ✨, kies een stijl en pas grootte, dichtheid en kleuren aan.
4. Schrijf je boodschap en download een video of GIF, sla de pagina op of deel hem.

## 🚀 Starten vanuit de broncode

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Ontwikkeling

Architectuur, API, tests en vertaalgids: zie de [hoofd-README](../../README.md#development).

## 📜 Licentie

[MIT](../../LICENSE) © noms6

De Windows-versie bevat deze opensourcecomponenten: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
