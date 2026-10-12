<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Преврати любое видео в пиксель-арт, мозаику из цветов или ASCII-арт, добавь личное послание и поделись им.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · **Русский** · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

## ✨ Возможности

- Быстро: минутное видео 1080p преобразуется примерно за 7 секунд
- Все популярные форматы: MP4, MOV, WebM, AVI, MKV, WMV, FLV и другие (до 500 МБ)
- 28 стилей: обычный пиксель-арт, цветы, сердечки, фигуры, LED, ASCII и шрифт Брайля
- Палитры (авто, Game Boy, PICO-8, CGA, сепия…), дизеринг, яркость/контраст, обрезка
- Экспорт в видео MP4/WebM с исходной скоростью или в бесконечно повторяющийся GIF
- Сохранение веб-страницы в одном файле с посланием и эффектом печатной машинки (100–500 КБ, работает офлайн)
- Доступно на 24 языках, язык выбирается автоматически по браузеру
- Работает полностью на твоём компьютере — видео никуда не загружаются

## 📥 Скачать (Windows)

1. Скачай `PixelArtVideo-Windows-x64.zip` из [последней версии](https://github.com/noms6/pixel-art-video/releases/latest).
2. Распакуй и запусти `VideoASCIIArtConverter.exe` — браузер откроется сам. Python не нужен.

> Если Windows SmartScreen показывает предупреждение, нажми **Подробнее → Выполнить в любом случае** (приложение не подписано).

## 🖼️ Скриншоты

| | |
|---|---|
| <img src="../images/upload.png" alt=""><br>Загрузка видео | <img src="../images/preview.png" alt=""><br>Оригинал и пиксель-арт рядом |
| <img src="../images/result.png" alt=""><br>Выбери стиль и напиши послание | <img src="../images/mobile-rtl.png" width="260" alt=""><br>Телефон, языки с письмом справа налево |

## 🎨 Стили

| | | |
|---|---|---|
| <img src="../images/style-pixel.png" alt=""><br>Пиксель-арт | <img src="../images/style-rose.png" alt=""><br>Розы | <img src="../images/style-heart.png" alt=""><br>Сердечки |
| <img src="../images/style-ascii.png" alt=""><br>ASCII | <img src="../images/style-braille.png" alt=""><br>Шрифт Брайля | <img src="../images/style-led.png" alt=""><br>LED-экран |

## 🧭 Как пользоваться

1. Загрузи видео (перетащи или выбери файл). При желании сначала открой настройки преобразования.
2. Проверь предпросмотр. Измени настройки и преобразуй заново без повторной загрузки.
3. Нажми ✨ СТАРТ ✨, выбери стиль и настрой размер, плотность и цвета.
4. Напиши послание, затем скачай видео или GIF, сохрани страницу или поделись ею.

## 🚀 Запуск из исходного кода

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Разработка

Архитектура, API, тесты и руководство по переводу — в [основном README](../../README.md#development).

## 📜 Лицензия

[MIT](../../LICENSE) © noms6

Версия для Windows включает следующие компоненты с открытым исходным кодом: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
