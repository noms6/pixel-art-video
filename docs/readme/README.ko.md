<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**어떤 영상이든 픽셀 아트, 꽃 모자이크, ASCII 아트로 바꾸고 나만의 메시지를 더해 공유하세요.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · **한국어** · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="400" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="400" alt="ASCII demo">

</div>

## ✨ 기능

- 빠름: 1분짜리 1080p 영상을 약 7초 만에 변환
- 대부분의 형식 지원: MP4, MOV, WebM, AVI, MKV, WMV, FLV 등 (최대 500MB)
- 28가지 스타일: 기본 픽셀 아트, 꽃, 하트, 도형, LED, ASCII, 점자
- 팔레트(자동, Game Boy, PICO-8, CGA, 세피아…), 디더링, 밝기/대비, 구간 자르기
- 원래 속도의 MP4/WebM 영상 또는 무한 반복 GIF로 내보내기
- 메시지와 타자기 효과가 담긴 단일 파일 웹 페이지 저장 (100~500KB, 오프라인 작동)
- 24개 언어 지원, 브라우저 언어에 따라 자동 선택
- 완전히 내 컴퓨터에서 실행 — 영상이 어디에도 업로드되지 않습니다

## 📥 다운로드 (Windows)

1. [최신 릴리스](https://github.com/noms6/pixel-art-video/releases/latest)에서 `PixelArtVideo-Windows-x64.zip`을 다운로드하세요.
2. 압축을 풀고 `VideoASCIIArtConverter.exe`를 실행하면 브라우저가 자동으로 열립니다. Python은 필요 없습니다.

> Windows SmartScreen 경고가 뜨면 **추가 정보 → 실행**을 누르세요 (앱에 코드 서명이 없습니다).

## 🖼️ 스크린샷

<table>
<tr><td align="center"><img src="../images/upload.png" alt=""><br>영상 업로드</td><td align="center"><img src="../images/preview.png" alt=""><br>원본과 픽셀 아트를 나란히</td></tr>
<tr><td align="center"><img src="../images/result.png" alt=""><br>스타일을 고르고 메시지 작성</td><td align="center"><img src="../images/mobile-rtl.png" width="260" alt=""><br>모바일, 오른쪽에서 왼쪽으로 쓰는 언어</td></tr>
</table>

## 🎨 스타일

<table>
<tr><td align="center"><img src="../images/style-pixel.png" alt=""><br>픽셀 아트</td><td align="center"><img src="../images/style-rose.png" alt=""><br>장미</td><td align="center"><img src="../images/style-heart.png" alt=""><br>하트</td></tr>
<tr><td align="center"><img src="../images/style-ascii.png" alt=""><br>ASCII</td><td align="center"><img src="../images/style-braille.png" alt=""><br>점자</td><td align="center"><img src="../images/style-led.png" alt=""><br>LED 화면</td></tr>
</table>

## 🧭 사용 방법

1. 영상을 업로드하세요(끌어서 놓기 또는 파일 선택). 원하면 먼저 변환 설정을 여세요.
2. 미리보기를 확인하세요. 설정을 바꿔 다시 업로드하지 않고 재변환할 수 있습니다.
3. ✨ 시작 ✨을 누르고 스타일을 고른 뒤 크기, 밀도, 색상을 조정하세요.
4. 메시지를 쓰고 영상이나 GIF를 다운로드하거나, 페이지를 저장하거나 공유하세요.

## 🚀 소스 코드에서 실행

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ 개발

구조, API, 테스트, 번역 가이드는 [메인 README](../../README.md#development)를 참고하세요.

## 📜 라이선스

[MIT](../../LICENSE) © noms6

Windows 버전에는 다음 오픈 소스 구성 요소가 포함되어 있습니다: [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
