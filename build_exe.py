#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PyInstaller ile exe oluşturma scripti
"""

import PyInstaller.__main__
import os
import shutil
from pathlib import Path

# Önce PyInstaller'ı yükle
try:
    import PyInstaller
except ImportError:
    print("PyInstaller yükleniyor...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
    import PyInstaller

# Gerekli dosyalar
files_to_include = [
    'app.py',
    'pixel_art_converter.py',
    'pixel_flowers.py',
    'requirements.txt',
    'templates/index.html',
    'static/style.css',
    'static/script.js',
]

# Klasörleri oluştur
os.makedirs('uploads', exist_ok=True)
os.makedirs('static/outputs', exist_ok=True)

# İkon dosyasını kontrol et ve .ico'ya dönüştür
icon_path = None
icon_png = Path('icon.png')
if icon_png.exists():
    # PNG'yi ICO'ya dönüştürmek için PIL kullan
    try:
        from PIL import Image
        icon_ico = Path('icon.ico')
        img = Image.open(icon_png)
        # ICO formatı için farklı boyutlar oluştur
        icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
        img.save(icon_ico, format='ICO', sizes=icon_sizes)
        icon_path = str(icon_ico)
        print(f"✓ İkon oluşturuldu: {icon_path}")
    except Exception as e:
        print(f"⚠ İkon dönüştürme hatası: {e}")
        print("  PNG dosyası doğrudan kullanılacak...")
        icon_path = str(icon_png)
elif Path('icon.ico').exists():
    icon_path = str(Path('icon.ico'))

# PyInstaller parametreleri
pyinstaller_args = [
    'start_app.py',
    '--name=VideoASCIIArtConverter',
    '--onefile',
    '--console',  # Konsol penceresi ile (hata mesajları için)
    '--add-data=templates;templates',
    '--add-data=static;static',
    '--add-data=requirements.txt;.',
    '--hidden-import=flask',
    '--hidden-import=werkzeug',
    '--hidden-import=cv2',
    '--hidden-import=numpy',
    '--hidden-import=PIL',
    '--hidden-import=flask.app',
    '--hidden-import=flask.helpers',
    '--hidden-import=werkzeug.utils',
    '--hidden-import=werkzeug.security',
    '--collect-all=flask',
    '--collect-all=werkzeug',
    '--collect-all=cv2',
    '--exclude-module=pkg_resources.py2_warn',  # MemoryError sorununu önlemek için
    '--clean',
]

# İkon ekle
if icon_path:
    pyinstaller_args.append(f'--icon={icon_path}')
    print(f"✓ İkon eklendi: {icon_path}")
else:
    print("⚠ İkon dosyası bulunamadı (icon.png veya icon.ico)")

PyInstaller.__main__.run(pyinstaller_args)

print("\n✓ Exe dosyası oluşturuldu: dist/VideoASCIIArtConverter.exe")

