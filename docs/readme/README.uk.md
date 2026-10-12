<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Перетвори будь-яке відео на піксель-арт, мозаїку з квітів або ASCII-арт, додай особисте послання й поділися ним.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · **Українська** · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

## ✨ Можливості

- Швидко: хвилинне відео 1080p перетворюється приблизно за 7 секунд
- Усі поширені формати: MP4, MOV, WebM, AVI, MKV, WMV, FLV та інші (до 500 МБ)
- 28 стилів: звичайний піксель-арт, квіти, сердечка, фігури, LED, ASCII і шрифт Брайля
- Палітри (авто, Game Boy, PICO-8, CGA, сепія…), дизеринг, яскравість/контраст, обрізання
- Експорт у відео MP4/WebM з оригінальною швидкістю або в нескінченний GIF
- Збереження вебсторінки в одному файлі з посланням та ефектом друкарської машинки (100–500 КБ, працює офлайн)
- Доступно 24 мовами, мова обирається автоматично за браузером
- Працює повністю на твоєму комп’ютері — відео нікуди не завантажуються

## 📥 Завантажити (Windows)

1. Завантаж `PixelArtVideo-Windows-x64.zip` з [останньої версії](https://github.com/noms6/pixel-art-video/releases/latest).
2. Розпакуй і запусти `VideoASCIIArtConverter.exe` — браузер відкриється сам. Python не потрібен.

> Якщо Windows SmartScreen показує попередження, натисни **Докладніше → Усе одно запустити** (застосунок не підписано).

## 🖼️ Знімки екрана

| | |
|---|---|
| <img src="../images/upload.png" alt=""><br>Завантаження відео | <img src="../images/preview.png" alt=""><br>Оригінал і піксель-арт поруч |
| <img src="../images/result.png" alt=""><br>Обери стиль і напиши послання | <img src="../images/mobile-rtl.png" width="260" alt=""><br>Телефон, мови з письмом справа наліво |

## 🎨 Стилі

| | | |
|---|---|---|
| <img src="../images/style-pixel.png" alt=""><br>Піксель-арт | <img src="../images/style-rose.png" alt=""><br>Троянди | <img src="../images/style-heart.png" alt=""><br>Сердечка |
| <img src="../images/style-ascii.png" alt=""><br>ASCII | <img src="../images/style-braille.png" alt=""><br>Шрифт Брайля | <img src="../images/style-led.png" alt=""><br>LED-екран |

## 🧭 Як користуватися

1. Завантаж відео (перетягни або вибери файл). За бажання спершу відкрий налаштування перетворення.
2. Переглянь результат. Зміни налаштування й перетвори знову без повторного завантаження.
3. Натисни ✨ СТАРТ ✨, обери стиль і налаштуй розмір, щільність і кольори.
4. Напиши послання, потім завантаж відео чи GIF, збережи сторінку або поділися нею.

## 🚀 Запуск із вихідного коду

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Розробка

Архітектура, API, тести й посібник із перекладу — в [основному README](../../README.md#development).

## 📜 Ліцензія

[MIT](../../LICENSE) © noms6

Версія для Windows містить такі компоненти з відкритим кодом: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
