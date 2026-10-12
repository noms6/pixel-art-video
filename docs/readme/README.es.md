<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Convierte cualquier vídeo en pixel art, mosaicos de flores o arte ASCII, añade un mensaje personal y compártelo.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · **Español** · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

## ✨ Características

- Rápido: un vídeo 1080p de un minuto se convierte en unos 7 segundos
- Todos los formatos habituales: MP4, MOV, WebM, AVI, MKV, WMV, FLV y más (hasta 500 MB)
- 28 estilos: pixel art simple, flores, corazones, formas, LED, ASCII y Braille
- Paletas (automática, Game Boy, PICO-8, CGA, sepia…), tramado, brillo/contraste, recorte
- Exporta como vídeo MP4/WebM a la velocidad original o como GIF en bucle infinito
- Guarda una página web de un solo archivo con tu mensaje y efecto máquina de escribir (100–500 KB, sin conexión)
- Disponible en 24 idiomas, elegido automáticamente según tu navegador
- Funciona completamente en tu ordenador: tus vídeos no se suben a ningún sitio

## 📥 Descargar (Windows)

1. Descarga `PixelArtVideo-Windows-x64.zip` desde la [última versión](https://github.com/noms6/pixel-art-video/releases/latest).
2. Descomprímelo y ejecuta `VideoASCIIArtConverter.exe`: el navegador se abre solo. No hace falta Python.

> Si Windows SmartScreen muestra un aviso, pulsa **Más información → Ejecutar de todas formas** (la aplicación no está firmada).

## 🖼️ Capturas de pantalla

| | |
|---|---|
| <img src="../images/upload.png" alt=""><br>Subir un vídeo | <img src="../images/preview.png" alt=""><br>Original y pixel art lado a lado |
| <img src="../images/result.png" alt=""><br>Elige un estilo y escribe tu mensaje | <img src="../images/mobile-rtl.png" width="260" alt=""><br>Móvil, idiomas de derecha a izquierda |

## 🎨 Estilos

| | | |
|---|---|---|
| <img src="../images/style-pixel.png" alt=""><br>Pixel art | <img src="../images/style-rose.png" alt=""><br>Rosas | <img src="../images/style-heart.png" alt=""><br>Corazones |
| <img src="../images/style-ascii.png" alt=""><br>ASCII | <img src="../images/style-braille.png" alt=""><br>Braille | <img src="../images/style-led.png" alt=""><br>Pantalla LED |

## 🧭 Cómo se usa

1. Sube un vídeo (arrastra y suelta o elige un archivo). Si quieres, abre antes los ajustes de conversión.
2. Revisa la vista previa. Cambia los ajustes y convierte de nuevo sin volver a subirlo.
3. Pulsa ✨ EMPEZAR ✨, elige un estilo y ajusta el tamaño, la densidad y los colores.
4. Escribe tu mensaje y descarga un vídeo o un GIF, guarda la página o compártela.

## 🚀 Ejecutar desde el código fuente

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Desarrollo

Arquitectura, API, pruebas y guía de traducción: consulta el [README principal](../../README.md#development).

## 📜 Licencia

[MIT](../../LICENSE) © noms6

La versión para Windows incluye estos componentes de código abierto: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
