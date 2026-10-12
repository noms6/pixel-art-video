<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Herhangi bir videoyu pixel art’a, çiçek mozaiğine ya da ASCII sanatına dönüştür, kişisel mesajını ekle ve paylaş.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · **Türkçe** · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="400" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="400" alt="ASCII demo">

</div>

## ✨ Özellikler

- Hızlı: 1 dakikalık 1080p video yaklaşık 7 saniyede dönüşür
- Tüm yaygın formatlar: MP4, MOV, WebM, AVI, MKV, WMV, FLV ve daha fazlası (en fazla 500 MB)
- 28 stil: düz pixel art, çiçekler, kalpler, şekiller, LED, ASCII ve Braille
- Paletler (otomatik, Game Boy, PICO-8, CGA, sepya…), dithering, parlaklık/kontrast, kırpma
- Orijinal hızında MP4/WebM video ya da sonsuz döngülü GIF olarak dışa aktarma
- Mesajlı ve daktilo efektli tek dosyalık web sayfası (100–500 KB, internetsiz çalışır)
- 24 dilde kullanılabilir, tarayıcı diline göre otomatik seçilir
- Tamamen bilgisayarında çalışır — videoların hiçbir yere yüklenmez

## 📥 İndir (Windows)

1. [Son sürümden](https://github.com/noms6/pixel-art-video/releases/latest) `PixelArtVideo-Windows-x64.zip` dosyasını indir.
2. Klasöre çıkar ve `VideoASCIIArtConverter.exe`’yi çalıştır — tarayıcı otomatik açılır. Python gerekmez.

> Windows SmartScreen uyarırsa **Ek bilgi → Yine de çalıştır**’a tıkla (uygulama dijital imzalı değil).

## 🖼️ Ekran görüntüleri

<table>
<tr><td align="center"><img src="../images/upload.png" alt=""><br>Video yükle</td><td align="center"><img src="../images/preview.png" alt=""><br>Orijinal ve pixel art yan yana</td></tr>
<tr><td align="center"><img src="../images/result.png" alt=""><br>Stil seç ve mesajını yaz</td><td align="center"><img src="../images/mobile-rtl.png" width="260" alt=""><br>Mobil, sağdan sola diller</td></tr>
</table>

## 🎨 Stiller

<table>
<tr><td align="center"><img src="../images/style-pixel.png" alt=""><br>Pixel art</td><td align="center"><img src="../images/style-rose.png" alt=""><br>Güller</td><td align="center"><img src="../images/style-heart.png" alt=""><br>Kalpler</td></tr>
<tr><td align="center"><img src="../images/style-ascii.png" alt=""><br>ASCII</td><td align="center"><img src="../images/style-braille.png" alt=""><br>Braille</td><td align="center"><img src="../images/style-led.png" alt=""><br>LED ekran</td></tr>
</table>

## 🧭 Kullanım

1. Video yükle (sürükle-bırak ya da dosya seç). İstersen önce dönüştürme ayarlarını aç.
2. Önizlemeyi kontrol et. Ayarları değiştirip videoyu tekrar yüklemeden yeniden dönüştür.
3. ✨ BAŞLA ✨’ya bas, stili seç; boyut, yoğunluk ve renkleri ayarla.
4. Mesajını yaz, sonra video ya da GIF indir, sayfayı kaydet veya paylaş.

## 🚀 Kaynak koddan çalıştırma

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Geliştirme

Mimari, API, testler ve çeviri rehberi için [ana README](../../README.md#development) sayfasına bak. Proje analizi ve yol haritası: [docs/ANALIZ_VE_PLAN.md](../ANALIZ_VE_PLAN.md).

## 📜 Lisans

[MIT](../../LICENSE) © noms6

Windows sürümü şu açık kaynak bileşenleri içerir: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
