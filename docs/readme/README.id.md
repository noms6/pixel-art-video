<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Ubah video apa pun menjadi pixel art, mozaik bunga, atau seni ASCII, tambahkan pesan pribadi, lalu bagikan.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · **Bahasa Indonesia** · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

## ✨ Fitur

- Cepat: video 1080p berdurasi 1 menit dikonversi sekitar 7 detik
- Semua format umum: MP4, MOV, WebM, AVI, MKV, WMV, FLV, dan lainnya (hingga 500 MB)
- 28 gaya: pixel art polos, bunga, hati, bentuk, LED, ASCII, dan Braille
- Palet (otomatis, Game Boy, PICO-8, CGA, sepia…), dithering, kecerahan/kontras, pemotongan
- Ekspor sebagai video MP4/WebM dengan kecepatan asli atau GIF yang berulang tanpa henti
- Simpan halaman web satu file berisi pesanmu dan efek mesin ketik (100–500 KB, bisa offline)
- Tersedia dalam 24 bahasa, dipilih otomatis sesuai browser
- Berjalan sepenuhnya di komputermu — videomu tidak diunggah ke mana pun

## 📥 Unduh (Windows)

1. Unduh `PixelArtVideo-Windows-x64.zip` dari [rilis terbaru](https://github.com/noms6/pixel-art-video/releases/latest).
2. Ekstrak lalu jalankan `VideoASCIIArtConverter.exe` — browser terbuka otomatis. Tidak perlu Python.

> Jika Windows SmartScreen memberi peringatan, klik **Info selengkapnya → Tetap jalankan** (aplikasi belum ditandatangani).

## 🖼️ Tangkapan layar

| | |
|---|---|
| <img src="../images/upload.png" alt=""><br>Unggah video | <img src="../images/preview.png" alt=""><br>Asli dan pixel art berdampingan |
| <img src="../images/result.png" alt=""><br>Pilih gaya dan tulis pesanmu | <img src="../images/mobile-rtl.png" width="260" alt=""><br>Ponsel, bahasa kanan-ke-kiri |

## 🎨 Gaya

| | | |
|---|---|---|
| <img src="../images/style-pixel.png" alt=""><br>Pixel art | <img src="../images/style-rose.png" alt=""><br>Mawar | <img src="../images/style-heart.png" alt=""><br>Hati |
| <img src="../images/style-ascii.png" alt=""><br>ASCII | <img src="../images/style-braille.png" alt=""><br>Braille | <img src="../images/style-led.png" alt=""><br>Layar LED |

## 🧭 Cara pakai

1. Unggah video (seret dan lepas atau pilih file). Bila perlu, buka pengaturan konversi terlebih dahulu.
2. Periksa pratinjau. Ubah pengaturan dan konversi ulang tanpa mengunggah lagi.
3. Tekan ✨ MULAI ✨, pilih gaya, lalu atur ukuran, kepadatan, dan warna.
4. Tulis pesanmu, lalu unduh video atau GIF, simpan halaman, atau bagikan.

## 🚀 Menjalankan dari kode sumber

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Pengembangan

Arsitektur, API, pengujian, dan panduan terjemahan: lihat [README utama](../../README.md#development).

## 📜 Lisensi

[MIT](../../LICENSE) © noms6

Versi Windows menyertakan komponen sumber terbuka berikut: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
