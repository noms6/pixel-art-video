<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**İstənilən videonu piksel arta, çiçək mozaikasına və ya ASCII sənətinə çevir, şəxsi mesajını əlavə et və paylaş.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · **Azərbaycanca** · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

## ✨ İmkanlar

- Sürətli: 1 dəqiqəlik 1080p video təxminən 7 saniyəyə çevrilir
- Bütün yayğın formatlar: MP4, MOV, WebM, AVI, MKV, WMV, FLV və s. (maksimum 500 MB)
- 28 stil: sadə piksel art, çiçəklər, ürəklər, fiqurlar, LED, ASCII və Brayl
- Palitralar (avtomatik, Game Boy, PICO-8, CGA, sepiya…), dithering, parlaqlıq/kontrast, kəsmə
- Orijinal sürətdə MP4/WebM video və ya sonsuz təkrarlanan GIF kimi ixrac
- Mesajın və yazı makinası effekti olan tək faylda veb səhifə (100–500 KB, internetsiz işləyir)
- 24 dildə mövcuddur, brauzerə görə avtomatik seçilir
- Tamamilə öz kompüterində işləyir — videoların heç yerə yüklənmir

## 📥 Endir (Windows)

1. [Son versiyadan](https://github.com/noms6/pixel-art-video/releases/latest) `PixelArtVideo-Windows-x64.zip` faylını endir.
2. Arxivi aç və `VideoASCIIArtConverter.exe`-ni işə sal — brauzer avtomatik açılır. Python lazım deyil.

> Windows SmartScreen xəbərdarlıq edərsə, **Ətraflı → Yenə də işə sal** düyməsinə bas (tətbiq imzalı deyil).

## 🖼️ Ekran görüntüləri

| | |
|---|---|
| <img src="../images/upload.png" alt=""><br>Video yüklə | <img src="../images/preview.png" alt=""><br>Orijinal və piksel art yan-yana |
| <img src="../images/result.png" alt=""><br>Stil seç və mesajını yaz | <img src="../images/mobile-rtl.png" width="260" alt=""><br>Mobil, sağdan sola yazılan dillər |

## 🎨 Stillər

| | | |
|---|---|---|
| <img src="../images/style-pixel.png" alt=""><br>Piksel art | <img src="../images/style-rose.png" alt=""><br>Qızılgüllər | <img src="../images/style-heart.png" alt=""><br>Ürəklər |
| <img src="../images/style-ascii.png" alt=""><br>ASCII | <img src="../images/style-braille.png" alt=""><br>Brayl | <img src="../images/style-led.png" alt=""><br>LED ekran |

## 🧭 İstifadə qaydası

1. Video yüklə (sürüklə-burax və ya fayl seç). İstəsən əvvəlcə çevirmə ayarlarını aç.
2. Önizləməni yoxla. Ayarları dəyiş və yenidən yükləmədən təkrar çevir.
3. ✨ BAŞLA ✨ düyməsinə bas, stil seç; ölçünü, sıxlığı və rəngləri tənzimlə.
4. Mesajını yaz, sonra video və ya GIF endir, səhifəni saxla və ya paylaş.

## 🚀 Mənbə kodundan işə salmaq

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Tərtibat

Arxitektura, API, testlər və tərcümə bələdçisi: [əsas README](../../README.md#development) səhifəsinə bax.

## 📜 Lisenziya

[MIT](../../LICENSE) © noms6

Windows versiyasına bu açıq mənbəli komponentlər daxildir: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
