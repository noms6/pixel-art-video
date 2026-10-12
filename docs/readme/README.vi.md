<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Biến mọi video thành pixel art, tranh khảm hoa hoặc nghệ thuật ASCII, thêm lời nhắn riêng và chia sẻ.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · **Tiếng Việt** · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="400" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="400" alt="ASCII demo">

</div>

## ✨ Tính năng

- Nhanh: video 1080p dài 1 phút chuyển đổi trong khoảng 7 giây
- Hỗ trợ mọi định dạng phổ biến: MP4, MOV, WebM, AVI, MKV, WMV, FLV… (tối đa 500 MB)
- 28 phong cách: pixel art đơn giản, hoa, trái tim, hình khối, LED, ASCII và chữ nổi Braille
- Bảng màu (tự động, Game Boy, PICO-8, CGA, nâu đỏ cổ điển…), dithering, độ sáng/tương phản, cắt đoạn
- Xuất video MP4/WebM đúng tốc độ gốc hoặc ảnh GIF lặp vô hạn
- Lưu trang web một tệp kèm lời nhắn và hiệu ứng máy đánh chữ (100–500 KB, chạy ngoại tuyến)
- Có 24 ngôn ngữ, tự chọn theo trình duyệt
- Chạy hoàn toàn trên máy tính của bạn — video không bị tải lên đâu cả

## 📥 Tải xuống (Windows)

1. Tải `PixelArtVideo-Windows-x64.zip` từ [bản phát hành mới nhất](https://github.com/noms6/pixel-art-video/releases/latest).
2. Giải nén và chạy `VideoASCIIArtConverter.exe` — trình duyệt tự mở. Không cần Python.

> Nếu Windows SmartScreen cảnh báo, hãy nhấp **Thông tin thêm → Vẫn chạy** (ứng dụng chưa được ký số).

## 🖼️ Ảnh chụp màn hình

<table>
<tr><td align="center"><img src="../images/upload.png" alt=""><br>Tải video lên</td><td align="center"><img src="../images/preview.png" alt=""><br>Bản gốc và pixel art đặt cạnh nhau</td></tr>
<tr><td align="center"><img src="../images/result.png" alt=""><br>Chọn phong cách và viết lời nhắn</td><td align="center"><img src="../images/mobile-rtl.png" width="260" alt=""><br>Điện thoại, ngôn ngữ viết từ phải sang trái</td></tr>
</table>

## 🎨 Phong cách

<table>
<tr><td align="center"><img src="../images/style-pixel.png" alt=""><br>Pixel art</td><td align="center"><img src="../images/style-rose.png" alt=""><br>Hoa hồng</td><td align="center"><img src="../images/style-heart.png" alt=""><br>Trái tim</td></tr>
<tr><td align="center"><img src="../images/style-ascii.png" alt=""><br>ASCII</td><td align="center"><img src="../images/style-braille.png" alt=""><br>Chữ nổi</td><td align="center"><img src="../images/style-led.png" alt=""><br>Màn hình LED</td></tr>
</table>

## 🧭 Cách dùng

1. Tải video lên (kéo thả hoặc chọn tệp). Bạn có thể mở cài đặt chuyển đổi trước.
2. Xem trước kết quả. Đổi cài đặt và chuyển đổi lại mà không cần tải lên lần nữa.
3. Nhấn ✨ BẮT ĐẦU ✨, chọn phong cách và chỉnh kích thước, mật độ, màu sắc.
4. Viết lời nhắn rồi tải video hoặc GIF, lưu trang hoặc chia sẻ.

## 🚀 Chạy từ mã nguồn

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Phát triển

Kiến trúc, API, kiểm thử và hướng dẫn dịch: xem [README chính](../../README.md#development).

## 📜 Giấy phép

[MIT](../../LICENSE) © noms6

Bản Windows có kèm các thành phần mã nguồn mở sau: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
