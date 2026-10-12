<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Trasforma qualsiasi video in pixel art, mosaici di fiori o arte ASCII, aggiungi un messaggio personale e condividilo.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · **Italiano** · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="400" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="400" alt="ASCII demo">

</div>

## ✨ Funzionalità

- Veloce: un video 1080p di un minuto si converte in circa 7 secondi
- Tutti i formati comuni: MP4, MOV, WebM, AVI, MKV, WMV, FLV e altri (fino a 500 MB)
- 28 stili: pixel art semplice, fiori, cuori, forme, LED, ASCII e Braille
- Tavolozze (automatica, Game Boy, PICO-8, CGA, seppia…), retinatura, luminosità/contrasto, taglio
- Esporta come video MP4/WebM alla velocità originale o come GIF in loop infinito
- Salva una pagina web in un unico file con il tuo messaggio ed effetto macchina da scrivere (100–500 KB, offline)
- Disponibile in 24 lingue, scelta automaticamente in base al browser
- Funziona interamente sul tuo computer: i tuoi video non vengono caricati da nessuna parte

## 📥 Download (Windows)

1. Scarica `PixelArtVideo-Windows-x64.zip` dall’[ultima versione](https://github.com/noms6/pixel-art-video/releases/latest).
2. Estrai il file ed esegui `VideoASCIIArtConverter.exe`: il browser si apre da solo. Python non serve.

> Se Windows SmartScreen mostra un avviso, fai clic su **Ulteriori informazioni → Esegui comunque** (l’app non è firmata).

## 🖼️ Schermate

<table>
<tr><td align="center"><img src="../images/upload.png" alt=""><br>Carica un video</td><td align="center"><img src="../images/preview.png" alt=""><br>Originale e pixel art affiancati</td></tr>
<tr><td align="center"><img src="../images/result.png" alt=""><br>Scegli uno stile e scrivi il tuo messaggio</td><td align="center"><img src="../images/mobile-rtl.png" width="260" alt=""><br>Mobile, lingue da destra a sinistra</td></tr>
</table>

## 🎨 Stili

<table>
<tr><td align="center"><img src="../images/style-pixel.png" alt=""><br>Pixel art</td><td align="center"><img src="../images/style-rose.png" alt=""><br>Rose</td><td align="center"><img src="../images/style-heart.png" alt=""><br>Cuori</td></tr>
<tr><td align="center"><img src="../images/style-ascii.png" alt=""><br>ASCII</td><td align="center"><img src="../images/style-braille.png" alt=""><br>Braille</td><td align="center"><img src="../images/style-led.png" alt=""><br>Schermo LED</td></tr>
</table>

## 🧭 Come si usa

1. Carica un video (trascina o scegli un file). Se vuoi, apri prima le impostazioni di conversione.
2. Controlla l’anteprima. Cambia le impostazioni e riconverti senza ricaricare il video.
3. Premi ✨ INIZIA ✨, scegli uno stile e regola dimensione, densità e colori.
4. Scrivi il tuo messaggio, poi scarica un video o una GIF, salva la pagina o condividila.

## 🚀 Avvio dal codice sorgente

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Sviluppo

Architettura, API, test e guida alla traduzione: vedi il [README principale](../../README.md#development).

## 📜 Licenza

[MIT](../../LICENSE) © noms6

La versione per Windows include questi componenti open source: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
