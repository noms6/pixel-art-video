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
        f'--add-data={ROOT / "static" / "js"}{sep}static/js',
        f'--paths={ROOT}',
        '--hidden-import=waitress',
        '--hidden-import=app',
        '--hidden-import=converter',
        '--hidden-import=jobs',
    ]
    options += [f'--exclude-module={m}' for m in EXCLUDES]
    icon = ROOT / 'icon.ico'
    if icon.exists():
        options.append(f'--icon={icon}')

    PyInstaller.__main__.run(options)
    target = Path(args.distpath) / (f'{NAME}.exe' if args.onefile else f'{NAME}/{NAME}.exe')
    print(f'\n✓ Oluşturuldu: {target}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
