<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Transforme qualquer vídeo em pixel art, mosaicos de flores ou arte ASCII, adicione uma mensagem pessoal e compartilhe.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · **Português** · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

## ✨ Recursos

- Rápido: um vídeo 1080p de um minuto é convertido em cerca de 7 segundos
- Todos os formatos comuns: MP4, MOV, WebM, AVI, MKV, WMV, FLV e mais (até 500 MB)
- 28 estilos: pixel art simples, flores, corações, formas, LED, ASCII e Braille
- Paletas (automática, Game Boy, PICO-8, CGA, sépia…), pontilhado, brilho/contraste, corte
- Exporte como vídeo MP4/WebM na velocidade original ou como GIF em loop infinito
- Salve uma página web em um único arquivo com sua mensagem e efeito máquina de escrever (100–500 KB, offline)
- Disponível em 24 idiomas, escolhido automaticamente pelo navegador
- Roda totalmente no seu computador — seus vídeos não são enviados para lugar nenhum

## 📥 Baixar (Windows)

1. Baixe `PixelArtVideo-Windows-x64.zip` na [versão mais recente](https://github.com/noms6/pixel-art-video/releases/latest).
2. Extraia e execute `VideoASCIIArtConverter.exe` — o navegador abre sozinho. Não precisa de Python.

> Se o Windows SmartScreen avisar, clique em **Mais informações → Executar assim mesmo** (o app não é assinado).

## 🖼️ Capturas de tela

| | |
|---|---|
| <img src="../images/upload.png" alt=""><br>Enviar um vídeo | <img src="../images/preview.png" alt=""><br>Original e pixel art lado a lado |
| <img src="../images/result.png" alt=""><br>Escolha um estilo e escreva sua mensagem | <img src="../images/mobile-rtl.png" width="260" alt=""><br>Celular, idiomas da direita para a esquerda |

## 🎨 Estilos

| | | |
|---|---|---|
| <img src="../images/style-pixel.png" alt=""><br>Pixel art | <img src="../images/style-rose.png" alt=""><br>Rosas | <img src="../images/style-heart.png" alt=""><br>Corações |
| <img src="../images/style-ascii.png" alt=""><br>ASCII | <img src="../images/style-braille.png" alt=""><br>Braille | <img src="../images/style-led.png" alt=""><br>Tela de LED |

## 🧭 Como usar

1. Envie um vídeo (arraste e solte ou escolha um arquivo). Se quiser, abra antes as configurações de conversão.
2. Confira a prévia. Mude as configurações e converta de novo sem reenviar.
3. Toque em ✨ COMEÇAR ✨, escolha um estilo e ajuste tamanho, densidade e cores.
4. Escreva sua mensagem e baixe um vídeo ou GIF, salve a página ou compartilhe.

## 🚀 Executar a partir do código-fonte

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Desenvolvimento

Arquitetura, API, testes e guia de tradução: veja o [README principal](../../README.md#development).

## 📜 Licença

[MIT](../../LICENSE) © noms6

A versão para Windows inclui estes componentes de código aberto: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
