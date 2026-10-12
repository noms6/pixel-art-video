<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**هر ویدیویی را به پیکسل‌آرت، موزاییک گل یا هنر ASCII تبدیل کن، یک پیام شخصی اضافه کن و به اشتراک بگذار.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · **فارسی** · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="400" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="400" alt="ASCII demo">

</div>

<div dir="rtl">

## ✨ ویژگی‌ها

- سریع: یک ویدیوی ۱۰۸۰p یک‌دقیقه‌ای حدود ۷ ثانیه‌ای تبدیل می‌شود
- همه قالب‌های رایج: MP4، MOV، WebM، AVI، MKV، WMV، FLV و بیشتر (تا ۵۰۰ مگابایت)
- ۲۸ سبک: پیکسل‌آرت ساده، گل‌ها، قلب‌ها، شکل‌ها، LED، ASCII و بریل
- پالت‌ها (خودکار، Game Boy، PICO-8، CGA، سپیا…)، دیترینگ، روشنایی/کنتراست، برش
- خروجی به‌صورت ویدیوی MP4/WebM با سرعت اصلی یا GIF با تکرار بی‌پایان
- ذخیره یک صفحه وب تک‌فایلی با پیام تو و جلوه ماشین تحریر (۱۰۰ تا ۵۰۰ کیلوبایت، بدون اینترنت)
- در دسترس به ۲۴ زبان، که خودکار بر اساس مرورگر انتخاب می‌شود
- کاملاً روی رایانه خودت اجرا می‌شود — ویدیوهایت هیچ‌جا بارگذاری نمی‌شوند

## 📥 دانلود (Windows)

1. فایل `PixelArtVideo-Windows-x64.zip` را از [آخرین نسخه](https://github.com/noms6/pixel-art-video/releases/latest) دانلود کن.
2. آن را از حالت فشرده خارج کن و `VideoASCIIArtConverter.exe` را اجرا کن — مرورگر خودکار باز می‌شود. به Python نیازی نیست.

> اگر Windows SmartScreen هشدار داد، روی **اطلاعات بیشتر ← به هر حال اجرا شود** کلیک کن (برنامه امضای دیجیتال ندارد).

## 🖼️ تصاویر صفحه

<table>
<tr><td align="center"><img src="../images/upload.png" alt=""><br>بارگذاری ویدیو</td><td align="center"><img src="../images/preview.png" alt=""><br>اصلی و پیکسل‌آرت کنار هم</td></tr>
<tr><td align="center"><img src="../images/result.png" alt=""><br>یک سبک انتخاب کن و پیامت را بنویس</td><td align="center"><img src="../images/mobile-rtl.png" width="260" alt=""><br>موبایل، زبان‌های راست به چپ</td></tr>
</table>

## 🎨 سبک‌ها

<table>
<tr><td align="center"><img src="../images/style-pixel.png" alt=""><br>پیکسل‌آرت</td><td align="center"><img src="../images/style-rose.png" alt=""><br>رزها</td><td align="center"><img src="../images/style-heart.png" alt=""><br>قلب‌ها</td></tr>
<tr><td align="center"><img src="../images/style-ascii.png" alt=""><br>ASCII</td><td align="center"><img src="../images/style-braille.png" alt=""><br>بریل</td><td align="center"><img src="../images/style-led.png" alt=""><br>صفحه LED</td></tr>
</table>

## 🧭 نحوه استفاده

1. یک ویدیو بارگذاری کن (بکش و رها کن یا فایل را انتخاب کن). می‌توانی اول تنظیمات تبدیل را باز کنی.
2. پیش‌نمایش را بررسی کن. تنظیمات را تغییر بده و بدون بارگذاری دوباره، دوباره تبدیل کن.
3. روی ✨ شروع ✨ بزن، سبک را انتخاب کن و اندازه، تراکم و رنگ‌ها را تنظیم کن.
4. پیامت را بنویس، سپس ویدیو یا GIF دانلود کن، صفحه را ذخیره کن یا به اشتراک بگذار.

## 🚀 اجرا از کد منبع

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ توسعه

معماری، API، آزمون‌ها و راهنمای ترجمه: [README اصلی](../../README.md#development) را ببین.

## 📜 مجوز

[MIT](../../LICENSE) © noms6

نسخه Windows این اجزای متن‌باز را در بر دارد: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)

</div>
