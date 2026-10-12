#!/usr/bin/env python
"""
PyInstaller ile Windows uygulaması oluşturur.

    python build_exe.py              → dist/VideoASCIIArtConverter/VideoASCIIArtConverter.exe (klasör, hızlı açılır)
    python build_exe.py --onefile    → dist/VideoASCIIArtConverter.exe (tek dosya, her açılışta TEMP'e açılır)
    python build_exe.py --distpath X → çıktıyı başka klasöre yaz
"""

import argparse
import os
import sys
from pathlib import Path

ROOT = Path(__file__).parent
NAME = 'VideoASCIIArtConverter'

# Çalışma zamanında kullanılmayan büyük modüller
EXCLUDES = ['tkinter', 'unittest', 'pytest', 'PIL', 'matplotlib', 'IPython', 'pydoc', 'test', 'setuptools', 'pip',
            'cryptography', 'yaml']


ICON_SIZES = [16, 20, 24, 32, 40, 48, 64, 96, 128, 256]


def ensure_icon():
    """icon.png'den kare, çok boyutlu icon.ico üret (png daha yeniyse ya da ico yoksa)."""
    png, ico = ROOT / 'icon.png', ROOT / 'icon.ico'
    if not png.exists():
        return ico if ico.exists() else None
    if ico.exists() and ico.stat().st_mtime >= png.stat().st_mtime:
        return ico
    try:
        from PIL import Image
    except ImportError:
        print('⚠ Pillow yok, mevcut icon.ico kullanılıyor (pip install pillow)')
        return ico if ico.exists() else None
    img = Image.open(png).convert('RGBA')
    w, h = img.size
    side = min(w, h)
    # Dikey görselde üstten biraz pay bırakarak yüzlerin olduğu kare bölgeyi al
    left = (w - side) // 2
    top = max(0, min(h - side, int((h - side) * 0.3)))
    square = img.crop((left, top, left + side, top + side))
    square.save(ico, format='ICO', sizes=[(n, n) for n in ICON_SIZES])
    print(f'✓ İkon oluşturuldu: {ico.name} ({", ".join(map(str, ICON_SIZES))} px)')
    return ico


def main():
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding='utf-8', errors='replace')
        except Exception:
            pass
    parser = argparse.ArgumentParser()
    parser.add_argument('--onefile', action='store_true')
    parser.add_argument('--distpath', default=str(ROOT / 'dist'))
    parser.add_argument('--workpath', default=str(ROOT / 'build'))
    args = parser.parse_args()

    try:
        import PyInstaller.__main__
    except ImportError:
        print('PyInstaller bulunamadı. Kurmak için: pip install -r requirements-dev.txt')
        return 1

    sep = os.pathsep
    options = [
        str(ROOT / 'start_app.py'),
        f'--name={NAME}',
        '--onefile' if args.onefile else '--onedir',
        '--console',
        '--noconfirm',
        '--clean',
        f'--distpath={args.distpath}',
        f'--workpath={args.workpath}',
        f'--specpath={args.workpath}',
        f'--add-data={ROOT / "templates"}{sep}templates',
        # static/ klasörünün tamamı değil: eski çalışma çıktıları (static/outputs) pakete girmesin
        f'--add-data={ROOT / "static" / "style.css"}{sep}static',
        f'--add-data={ROOT / "static" / "favicon.png"}{sep}static',
        f'--add-data={ROOT / "static" / "js"}{sep}static/js',
        f'--add-data={ROOT / "static" / "i18n"}{sep}static/i18n',
        f'--paths={ROOT}',
        '--hidden-import=waitress',
        '--hidden-import=app',
        '--hidden-import=converter',
        '--hidden-import=jobs',
    ]
    options += [f'--exclude-module={m}' for m in EXCLUDES]
    icon = ensure_icon()
    if icon:
        options.append(f'--icon={icon}')

    PyInstaller.__main__.run(options)
    target = Path(args.distpath) / (f'{NAME}.exe' if args.onefile else f'{NAME}/{NAME}.exe')
    print(f'\n✓ Oluşturuldu: {target}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
