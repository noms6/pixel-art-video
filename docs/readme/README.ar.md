<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**حوّل أي فيديو إلى فن البكسل أو فسيفساء من الزهور أو فن ASCII، وأضف رسالة شخصية وشاركه.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · **العربية** · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

<div dir="rtl">

## ✨ المزايا

- سريع: يتحول فيديو 1080p مدته دقيقة واحدة في نحو 7 ثوانٍ
- جميع الصيغ الشائعة: MP4 وMOV وWebM وAVI وMKV وWMV وFLV وغيرها (حتى 500 ميغابايت)
- 28 نمطًا: فن بكسل بسيط وزهور وقلوب وأشكال وLED وASCII وبرايل
- لوحات ألوان (تلقائية، Game Boy، PICO-8، CGA، بني داكن…) وتنقيط وسطوع/تباين وقص
- التصدير كفيديو MP4/WebM بالسرعة الأصلية أو كصورة GIF متكررة بلا نهاية
- حفظ صفحة ويب في ملف واحد مع رسالتك وتأثير الآلة الكاتبة (100–500 كيلوبايت، تعمل دون إنترنت)
- متاح بـ 24 لغة تُختار تلقائيًا حسب المتصفح
- يعمل بالكامل على حاسوبك — لا تُرفع مقاطع الفيديو إلى أي مكان

## 📥 التنزيل (Windows)

1. نزّل `PixelArtVideo-Windows-x64.zip` من [أحدث إصدار](https://github.com/noms6/pixel-art-video/releases/latest).
2. فك الضغط وشغّل `VideoASCIIArtConverter.exe` — يفتح المتصفح تلقائيًا. لا حاجة إلى Python.

> إذا ظهر تحذير Windows SmartScreen فانقر **مزيد من المعلومات ← التشغيل على أي حال** (التطبيق غير موقّع رقميًا).

## 🖼️ لقطات الشاشة

| | |
|---|---|
| <img src="../images/upload.png" alt=""><br>رفع فيديو | <img src="../images/preview.png" alt=""><br>الأصلي وفن البكسل جنبًا إلى جنب |
| <img src="../images/result.png" alt=""><br>اختر نمطًا واكتب رسالتك | <img src="../images/mobile-rtl.png" width="260" alt=""><br>الهاتف، اللغات من اليمين إلى اليسار |

## 🎨 الأنماط

| | | |
|---|---|---|
| <img src="../images/style-pixel.png" alt=""><br>فن البكسل | <img src="../images/style-rose.png" alt=""><br>ورود | <img src="../images/style-heart.png" alt=""><br>قلوب |
| <img src="../images/style-ascii.png" alt=""><br>ASCII | <img src="../images/style-braille.png" alt=""><br>برايل | <img src="../images/style-led.png" alt=""><br>شاشة LED |

## 🧭 طريقة الاستخدام

1. ارفع فيديو (اسحب وأفلت أو اختر ملفًا). يمكنك فتح إعدادات التحويل أولًا.
2. راجع المعاينة. غيّر الإعدادات وأعد التحويل دون إعادة الرفع.
3. اضغط ✨ ابدأ ✨ واختر نمطًا واضبط الحجم والكثافة والألوان.
4. اكتب رسالتك ثم نزّل فيديو أو GIF أو احفظ الصفحة أو شاركها.

## 🚀 التشغيل من الشيفرة المصدرية

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ التطوير

البنية وواجهة API والاختبارات ودليل الترجمة: راجع [ملف README الرئيسي](../../README.md#development).

## 📜 الترخيص

[MIT](../../LICENSE) © noms6

يتضمن إصدار Windows مكونات المصدر المفتوح التالية: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)

</div>
