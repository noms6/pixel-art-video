<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Verwandle jedes Video in Pixel-Art, Blumenmosaike oder ASCII-Kunst, füge eine persönliche Nachricht hinzu und teile es.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · **Deutsch** · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="400" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="400" alt="ASCII demo">

</div>

## ✨ Funktionen

- Schnell: Ein einminütiges 1080p-Video ist in etwa 7 Sekunden umgewandelt
- Alle gängigen Formate: MP4, MOV, WebM, AVI, MKV, WMV, FLV und mehr (bis 500 MB)
- 28 Stile: einfache Pixel-Art, Blumen, Herzen, Formen, LED, ASCII und Braille
- Paletten (automatisch, Game Boy, PICO-8, CGA, Sepia…), Dithering, Helligkeit/Kontrast, Zuschneiden
- Export als MP4/WebM-Video in Originalgeschwindigkeit oder als endlos laufendes GIF
- Speichere eine einzelne Webseite mit deiner Nachricht und Schreibmaschinen-Effekt (100–500 KB, funktioniert offline)
- In 24 Sprachen verfügbar, automatisch nach Browsersprache gewählt
- Läuft komplett auf deinem Computer — deine Videos werden nirgendwohin hochgeladen

## 📥 Download (Windows)

1. Lade `PixelArtVideo-Windows-x64.zip` aus der [neuesten Version](https://github.com/noms6/pixel-art-video/releases/latest) herunter.
2. Entpacken und `VideoASCIIArtConverter.exe` starten — der Browser öffnet sich automatisch. Kein Python nötig.

> Falls Windows SmartScreen warnt: **Weitere Informationen → Trotzdem ausführen** (die App ist nicht signiert).

## 🖼️ Screenshots

<table>
<tr><td align="center"><img src="../images/upload.png" alt=""><br>Video hochladen</td><td align="center"><img src="../images/preview.png" alt=""><br>Original und Pixel-Art nebeneinander</td></tr>
<tr><td align="center"><img src="../images/result.png" alt=""><br>Stil wählen und Nachricht schreiben</td><td align="center"><img src="../images/mobile-rtl.png" width="260" alt=""><br>Mobil, Sprachen von rechts nach links</td></tr>
</table>

## 🎨 Stile

<table>
<tr><td align="center"><img src="../images/style-pixel.png" alt=""><br>Pixel-Art</td><td align="center"><img src="../images/style-rose.png" alt=""><br>Rosen</td><td align="center"><img src="../images/style-heart.png" alt=""><br>Herzen</td></tr>
<tr><td align="center"><img src="../images/style-ascii.png" alt=""><br>ASCII</td><td align="center"><img src="../images/style-braille.png" alt=""><br>Braille</td><td align="center"><img src="../images/style-led.png" alt=""><br>LED-Anzeige</td></tr>
</table>

## 🧭 Bedienung

1. Video hochladen (Drag & Drop oder Datei wählen). Optional vorher die Umwandlungseinstellungen öffnen.
2. Vorschau prüfen. Einstellungen ändern und ohne erneutes Hochladen neu umwandeln.
3. ✨ START ✨ drücken, Stil wählen und Größe, Dichte und Farben anpassen.
4. Nachricht schreiben, dann Video oder GIF herunterladen, die Seite speichern oder teilen.

## 🚀 Aus dem Quellcode starten

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Entwicklung

Architektur, API, Tests und Übersetzungsleitfaden: siehe [Haupt-README](../../README.md#development).

## 📜 Lizenz

[MIT](../../LICENSE) © noms6

Die Windows-Version enthält diese Open-Source-Komponenten: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
