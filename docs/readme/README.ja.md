<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**どんな動画もピクセルアート、花のモザイク、ASCII アートに変換。メッセージを添えて共有できます。**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · **日本語** · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="420" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="420" alt="ASCII demo">

</div>

## ✨ 主な機能

- 高速：1 分間の 1080p 動画を約 7 秒で変換
- 主要な形式に対応：MP4、MOV、WebM、AVI、MKV、WMV、FLV など（最大 500 MB）
- 28 種類のスタイル：シンプルなピクセルアート、花、ハート、図形、LED、ASCII、点字
- パレット（自動、Game Boy、PICO-8、CGA、セピア…）、ディザリング、明るさ/コントラスト、トリミング
- 元の速度の MP4/WebM 動画、または無限ループの GIF として書き出し
- メッセージとタイプライター効果付きの 1 ファイルの Web ページを保存（100〜500 KB、オフライン対応）
- 24 言語に対応。ブラウザーの言語で自動選択
- すべてあなたのパソコン上で動作。動画がどこかにアップロードされることはありません

## 📥 ダウンロード（Windows）

1. [最新リリース](https://github.com/noms6/pixel-art-video/releases/latest)から `PixelArtVideo-Windows-x64.zip` をダウンロードします。
2. 展開して `VideoASCIIArtConverter.exe` を実行すると、ブラウザーが自動で開きます。Python は不要です。

> Windows SmartScreen の警告が出た場合は **詳細情報 → 実行** をクリックしてください（アプリはコード署名されていません）。

## 🖼️ スクリーンショット

| | |
|---|---|
| <img src="../images/upload.png" alt=""><br>動画をアップロード | <img src="../images/preview.png" alt=""><br>元の動画とピクセルアートを並べて表示 |
| <img src="../images/result.png" alt=""><br>スタイルを選んでメッセージを書く | <img src="../images/mobile-rtl.png" width="260" alt=""><br>スマートフォン、右から左に書く言語 |

## 🎨 スタイル

| | | |
|---|---|---|
| <img src="../images/style-pixel.png" alt=""><br>ピクセルアート | <img src="../images/style-rose.png" alt=""><br>バラ | <img src="../images/style-heart.png" alt=""><br>ハート |
| <img src="../images/style-ascii.png" alt=""><br>ASCII | <img src="../images/style-braille.png" alt=""><br>点字 | <img src="../images/style-led.png" alt=""><br>LED スクリーン |

## 🧭 使い方

1. 動画をアップロード（ドラッグ＆ドロップまたはファイルを選択）。必要なら先に変換設定を開きます。
2. プレビューを確認。設定を変えて、再アップロードせずに再変換できます。
3. ✨ スタート ✨ を押し、スタイルを選んでサイズ・密度・色を調整します。
4. メッセージを書き、動画や GIF をダウンロード、ページを保存、または共有します。

## 🚀 ソースコードから実行

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ 開発

アーキテクチャ、API、テスト、翻訳ガイドは [メイン README](../../README.md#development) を参照してください。

## 📜 ライセンス

[MIT](../../LICENSE) © noms6

Windows 版には次のオープンソースコンポーネントが含まれています： [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
