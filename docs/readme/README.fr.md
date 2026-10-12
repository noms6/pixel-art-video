<div align="center">

<img src="../../static/favicon.png" width="72" alt="">

# Pixel Art Video

**Transforme n’importe quelle vidéo en pixel art, en mosaïque de fleurs ou en art ASCII, ajoute un message personnel et partage-la.**

[![Tests](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml/badge.svg)](https://github.com/noms6/pixel-art-video/actions/workflows/test.yml) [![Release](https://img.shields.io/github/v/release/noms6/pixel-art-video?color=ff6b9d)](https://github.com/noms6/pixel-art-video/releases/latest) [![Downloads](https://img.shields.io/github/downloads/noms6/pixel-art-video/total?color=c44569)](https://github.com/noms6/pixel-art-video/releases/latest) ![Languages](https://img.shields.io/badge/languages-24-8e44ad) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

🌐 [English](../../README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md) · **Français** · [Español](README.es.md) · [Italiano](README.it.md) · [Português](README.pt.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Română](README.ro.md) · [Svenska](README.sv.md) · [Ελληνικά](README.el.md) · [Русский](README.ru.md) · [Українська](README.uk.md) · [Azərbaycanca](README.az.md) · [العربية](README.ar.md) · [فارسی](README.fa.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文](README.zh.md) · [Bahasa Indonesia](README.id.md) · [Tiếng Việt](README.vi.md) · [ไทย](README.th.md)

<img src="../images/demo-hearts.gif" width="400" alt="Pixel Art Video demo"> <img src="../images/demo-ascii.gif" width="400" alt="ASCII demo">

</div>

## ✨ Fonctionnalités

- Rapide : une vidéo 1080p d’une minute est convertie en 7 secondes environ
- Tous les formats courants : MP4, MOV, WebM, AVI, MKV, WMV, FLV et plus (jusqu’à 500 Mo)
- 28 styles : pixel art simple, fleurs, cœurs, formes, LED, ASCII et Braille
- Palettes (auto, Game Boy, PICO-8, CGA, sépia…), tramage, luminosité/contraste, découpe
- Export en vidéo MP4/WebM à la vitesse d’origine ou en GIF qui tourne en boucle
- Enregistre une page web en un seul fichier avec ton message et un effet machine à écrire (100–500 Ko, hors ligne)
- Disponible en 24 langues, choisies automatiquement selon ton navigateur
- Fonctionne entièrement sur ton ordinateur — tes vidéos ne sont envoyées nulle part

## 📥 Télécharger (Windows)

1. Télécharge `PixelArtVideo-Windows-x64.zip` depuis la [dernière version](https://github.com/noms6/pixel-art-video/releases/latest).
2. Décompresse-le et lance `VideoASCIIArtConverter.exe` — le navigateur s’ouvre tout seul. Python n’est pas nécessaire.

> Si Windows SmartScreen affiche un avertissement : **Informations complémentaires → Exécuter quand même** (l’application n’est pas signée).

## 🖼️ Captures d’écran

<table>
<tr><td align="center"><img src="../images/upload.png" alt=""><br>Importer une vidéo</td><td align="center"><img src="../images/preview.png" alt=""><br>Original et pixel art côte à côte</td></tr>
<tr><td align="center"><img src="../images/result.png" alt=""><br>Choisis un style et écris ton message</td><td align="center"><img src="../images/mobile-rtl.png" width="260" alt=""><br>Mobile, langues de droite à gauche</td></tr>
</table>

## 🎨 Styles

<table>
<tr><td align="center"><img src="../images/style-pixel.png" alt=""><br>Pixel art</td><td align="center"><img src="../images/style-rose.png" alt=""><br>Roses</td><td align="center"><img src="../images/style-heart.png" alt=""><br>Cœurs</td></tr>
<tr><td align="center"><img src="../images/style-ascii.png" alt=""><br>ASCII</td><td align="center"><img src="../images/style-braille.png" alt=""><br>Braille</td><td align="center"><img src="../images/style-led.png" alt=""><br>Écran LED</td></tr>
</table>

## 🧭 Utilisation

1. Importe une vidéo (glisser-déposer ou choisir un fichier). Tu peux d’abord ouvrir les paramètres de conversion.
2. Vérifie l’aperçu. Modifie les paramètres et reconvertis sans réimporter.
3. Appuie sur ✨ C’EST PARTI ✨, choisis un style et règle la taille, la densité et les couleurs.
4. Écris ton message, puis télécharge une vidéo ou un GIF, enregistre la page ou partage-la.

## 🚀 Lancer depuis le code source

```bash
pip install -r requirements.txt
python start_app.py
```

## 🛠️ Développement

Architecture, API, tests et guide de traduction : voir le [README principal](../../README.md#development).

## 📜 Licence

[MIT](../../LICENSE) © noms6

La version Windows inclut ces composants open source : [OpenCV](https://opencv.org) (Apache 2.0) + [FFmpeg](https://ffmpeg.org) (LGPL 2.1) · [NumPy](https://numpy.org) (BSD) · [Flask](https://flask.palletsprojects.com) (BSD) · [Waitress](https://github.com/Pylons/waitress) (ZPL 2.1) · Python (PSF)
