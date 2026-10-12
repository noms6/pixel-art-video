#!/usr/bin/env python
"""
Pixel Art Video — başlatıcı.

Eksik paketleri kurar (exe dışında), boş bir port bulur, sunucuyu başlatır ve sunucu
hazır olunca tarayıcıyı açar. Ortam değişkenleri:
    PORT=5000                 tercih edilen port (doluysa sıradaki boş port kullanılır)
    PIXELART_NO_BROWSER=1     tarayıcıyı açma
    PIXELART_DATA_DIR=...     çalışma verisinin klasörü
"""

import os
import socket
import subprocess
import sys
import threading
import time
import urllib.request
import webbrowser
from pathlib import Path

FROZEN = getattr(sys, 'frozen', False)
REQUIRED = {'cv2': 'opencv-python', 'numpy': 'numpy', 'flask': 'flask', 'waitress': 'waitress'}


def configure_console():
    """Türkçe Windows konsolu (cp1254) veya yönlendirilmiş çıktıda emoji yüzünden çökmeyi önle."""
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)
        except Exception:
            pass


def pause_before_exit():
    if FROZEN:
        try:
            input('\nKapatmak için Enter\'a basın...')
        except Exception:
            time.sleep(5)


def ensure_packages():
    missing = []
    for module, package in REQUIRED.items():
        try:
            __import__(module)
        except ImportError:
            missing.append(package)
    if not missing:
        return True
    print(f'📦 Eksik paketler kuruluyor: {", ".join(missing)}')
    requirements = Path(__file__).parent / 'requirements.txt'
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', str(requirements)])
        return True
    except subprocess.CalledProcessError as e:
        print(f'✗ Paketler kurulamadı: {e}\n  Elle kurmak için: pip install -r requirements.txt')
        return False


def find_free_port(preferred):
    for port in [preferred] + list(range(preferred + 1, preferred + 50)):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('127.0.0.1', port))
                return port
            except OSError:
                continue
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def open_browser_when_ready(url):
    for _ in range(150):
        try:
            urllib.request.urlopen(url + 'api/config', timeout=1)
            break
        except Exception:
            time.sleep(0.1)
    webbrowser.open(url)


def main():
    configure_console()
    print('=' * 50)
    print('  🎨 Pixel Art Video')
    print('=' * 50)
    if not FROZEN and not ensure_packages():
        pause_before_exit()
        return 1

    if not FROZEN:
        sys.path.insert(0, str(Path(__file__).parent))
    from app import create_app, default_data_dir

    app = create_app()
    port = find_free_port(int(os.environ.get('PORT', 5000)))
    url = f'http://127.0.0.1:{port}/'
    print(f'✓ Uygulama çalışıyor: {url}')
    print(f'  Veriler: {default_data_dir()} (24 saatten eski dosyalar otomatik silinir)')
    print('  Kapatmak için bu pencereyi kapatın veya Ctrl+C\n')
    if os.environ.get('PIXELART_NO_BROWSER') != '1':
        threading.Thread(target=open_browser_when_ready, args=(url,), daemon=True).start()

    try:
        from waitress import serve
        serve(app, host='127.0.0.1', port=port, threads=8, channel_timeout=300)
    except ImportError:
        app.run(host='127.0.0.1', port=port, threaded=True)
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print('\n👋 Kapatılıyor...')
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f'\n✗ Beklenmeyen hata: {e}')
        pause_before_exit()
        sys.exit(1)
