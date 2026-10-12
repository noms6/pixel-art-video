<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Zamień dowolne wideo w pixel art, mozaikę z kwiatów lub sztukę ASCII, dodaj osobistą wiadomość i udostępnij.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · **Polski** · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

## ✨ Funkcje

- Szybko: minutowe wideo 1080p konwertuje się w około 7 sekund
- Wszystkie popularne formaty: MP4, MOV, WebM, AVI, MKV, WMV, FLV i inne (do 500 MB)
- 28 stylów: zwykły pixel art, kwiaty, serca, kształty, LED, ASCII i Braille
- Palety (automatyczna, Game Boy, PICO-8, CGA, sepia…), dithering, jasność/kontrast, przycinanie
- Eksport do wideo MP4/WebM z oryginalną prędkością lub do zapętlonego GIF-a
- Zapisz jednoplikową stronę z wiadomością i efektem maszyny do pisania (100–500 KB, działa offline)
- Dostępne w 24 językach, wybieranych automatycznie według przeglądarki
- Działa w całości na twoim komputerze — filmy nigdzie nie są wysyłane

## 📥 Pobierz (Windows)

1. Pobierz `PixelArtVideo-Windows-x64.zip` z [najnowszego wydania](https://github.com/noms6/pixel-art-video/releases/latest).
2. Rozpakuj i uruchom `VideoASCIIArtConverter.exe` — przeglądarka otworzy się sama. Python nie jest potrzebny.

> Jeśli Windows SmartScreen wyświetli ostrzeżenie, kliknij **Więcej informacji → Uruchom mimo to** (aplikacja nie jest podpisana).

## 🖼️ Zrzuty ekranu

| | |
|---|---|
| <img src="../images/upload.png" alt=""><br>Prześlij wideo | <img src="../images/preview.png" alt=""><br>Oryginał i pixel art obok siebie |
| <img src="../images/result.png" alt=""><br>Wybierz styl i napisz wiadomość | <img src="../images/mobile-rtl.png" width="260" alt=""><br>Telefon, języki pisane od prawej do lewej |

## 🎨 Style

| | | |
|---|---|---|
| <img src="../images/style-pixel.png" alt=""><br>Pixel art | <img src="../images/style-rose.png" alt=""><br>Róże | <img src="../images/style-heart.png" alt=""><br>Serca |
| <img src="../images/style-ascii.png" alt=""><br>ASCII | <img src="../images/style-braille.png" alt=""><br>Braille | <img src="../images/style-led.png" alt=""><br>Ekran LED |

## 🧭 Jak używać

1. Prześlij wideo (przeciągnij lub wybierz plik). Możesz najpierw otworzyć ustawienia konwersji.
2. Sprawdź podgląd. Zmień ustawienia i konwertuj ponownie bez ponownego przesyłania.
3. Naciśnij ✨ START ✨, wybierz styl i dostosuj rozmiar, gęstość i kolory.
4. Napisz wiadomość, a potem pobierz wideo lub GIF, zapisz stronę albo ją udostępnij.

## 🚀 Uruchamianie z kodu źródłowego

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Rozwój

Architektura, API, testy i przewodnik po tłumaczeniach: zobacz [główny README](../../README.md#development).

## 📜 Licencja

[MIT](../../LICENSE) © noms6

Wersja dla Windows zawiera te komponenty open source: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
