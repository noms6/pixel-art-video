#!/usr/bin/env python
"""
Pixel Art Video — başlatıcı.

Eksik paketleri kurar (exe dışında), boş bir port bulur, sunucuyu başlatır ve sunucu
hazır olunca tarayıcıyı açar. Ortam değişkenleri:
    PORT=5000                 tercih edilen port (doluysa sıradaki boş port kullanılır)
    PIXELART_NO_BROWSER=1     tarayıcıyı açma
    PIXELART_DATA_DIR=...     çalışma verisinin klasörü
"""

import locale
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
# Konsol mesajları: sistem dili Türkçe ise Türkçe, değilse İngilizce (arayüz 24 dili tarayıcıda seçer)
MESSAGES = {
    'tr': {
        'installing': '📦 Eksik paketler kuruluyor: {pkgs}',
        'install_failed': '✗ Paketler kurulamadı: {err}\n  Elle kurmak için: pip install -r requirements.txt',
        'running': '✓ Uygulama çalışıyor: {url}',
        'data': '  Veriler: {path} (24 saatten eski dosyalar otomatik silinir)',
        'close': '  Kapatmak için bu pencereyi kapatın veya Ctrl+C\n',
        'bye': '\n👋 Kapatılıyor...',
        'error': '\n✗ Beklenmeyen hata: {err}',
        'press_enter': '\nKapatmak için Enter\'a basın...',
    },
    'en': {
        'installing': '📦 Installing missing packages: {pkgs}',
        'install_failed': '✗ Could not install packages: {err}\n  Install manually: pip install -r requirements.txt',
        'running': '✓ App is running: {url}',
        'data': '  Data: {path} (files older than 24 hours are deleted automatically)',
        'close': '  Close this window or press Ctrl+C to quit\n',
        'bye': '\n👋 Shutting down...',
        'error': '\n✗ Unexpected error: {err}',
        'press_enter': '\nPress Enter to close...',
    },
}


def console_language():
    try:
        name = (locale.getlocale()[0] or os.environ.get('LANG', '')).lower()
    except Exception:
        name = ''
    return 'tr' if name.startswith(('tr', 'turkish')) else 'en'


def msg(key, **params):
    return MESSAGES[console_language()][key].format(**params)


REQUIRED = {'cv2': 'opencv-python-headless', 'numpy': 'numpy', 'flask': 'flask', 'waitress': 'waitress'}


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
            input(msg('press_enter'))
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
    print(msg('installing', pkgs=', '.join(missing)))
    requirements = Path(__file__).parent / 'requirements.txt'
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', str(requirements)])
        return True
    except subprocess.CalledProcessError as e:
        print(msg('install_failed', err=e))
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
    print(msg('running', url=url))
    print(msg('data', path=default_data_dir()))
    print(msg('close'))
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
        print(msg('bye'))
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(msg('error', err=e))
        pause_before_exit()
        sys.exit(1)
