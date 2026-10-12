#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Video ASCII Art Converter - Başlangıç Scripti
Python kontrolü, paket yükleme ve uygulama başlatma
"""

import sys
import subprocess
import webbrowser
import time
import os
import atexit
import signal
import shutil
from pathlib import Path

def cleanup_temp_folders():
    """Exe kapanırken oluşturulan geçici klasörleri temizle"""
    if not getattr(sys, 'frozen', False):
        return  # Normal modda temizlik yapma
    
    try:
        # Exe'nin bulunduğu dizin
        exe_dir = Path(sys.executable).parent
        
        folders_to_clean = ['uploads', 'static']
        
        # Birkaç kez dene (dosyalar kilitli olabilir)
        for attempt in range(5):
            all_cleaned = True
            for folder_name in folders_to_clean:
                folder_path = exe_dir / folder_name
                if folder_path.exists() and folder_path.is_dir():
                    try:
                        # Klasör içindeki tüm dosyaları sil
                        for item in list(folder_path.iterdir()):
                            try:
                                if item.is_file():
                                    item.unlink()
                                elif item.is_dir():
                                    shutil.rmtree(item, ignore_errors=True)
                            except (PermissionError, OSError):
                                all_cleaned = False
                        
                        # Klasörü sil
                        try:
                            folder_path.rmdir()
                        except (OSError, PermissionError):
                            # Klasör boş değil veya kilitli, force delete
                            shutil.rmtree(folder_path, ignore_errors=True)
                    except (PermissionError, OSError) as e:
                        all_cleaned = False
                        if attempt < 4:
                            time.sleep(0.3)  # Biraz bekle ve tekrar dene
            
            if all_cleaned:
                break
                
    except Exception:
        pass  # Sessizce geç

def wait_for_user():
    """Kullanıcının devam etmesini bekle (exe modunda çalışır)"""
    if getattr(sys, 'frozen', False):
        # Exe modunda - 5 saniye bekle
        print("\n5 saniye sonra devam ediliyor...")
        time.sleep(5)
    else:
        # Normal modda - input bekle
        try:
            input("\nDevam etmek için Enter'a basın...")
        except:
            time.sleep(3)

def check_python():
    """Python'un yüklü olup olmadığını kontrol et"""
    try:
        version = sys.version_info
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} bulundu")
        return True
    except:
        return False

def check_and_install_packages():
    """requirements.txt'deki paketleri kontrol et ve yükle"""
    # Exe içindeyse paket kontrolü yapma - paketler zaten gömülü
    if getattr(sys, 'frozen', False):
        print("\n📦 Exe modunda çalışıyor - paketler gömülü")
        # Sadece kritik paketleri kontrol et
        critical_packages = {
            'opencv-python': 'cv2',
            'flask': 'flask',
            'numpy': 'numpy',
            'pillow': 'PIL',
            'werkzeug': 'werkzeug'
        }
        
        missing = []
        for package_name, import_name in critical_packages.items():
            try:
                __import__(import_name)
                print(f"  ✓ {package_name} mevcut")
            except ImportError:
                print(f"  ✗ {package_name} bulunamadı!")
                missing.append(package_name)
        
        if missing:
            print(f"\n⚠ UYARI: {len(missing)} kritik paket eksik!")
            print("Exe dosyası düzgün paketlenmemiş olabilir.")
            wait_for_user()
            return False
        
        print("✓ Tüm kritik paketler mevcut!")
        return True
    
    # Normal Python script modunda - paket kontrolü ve yükleme
    base_path = Path(__file__).parent
    requirements_file = base_path / "requirements.txt"
    
    if not requirements_file.exists():
        print("⚠ requirements.txt bulunamadı! Paket kontrolü atlanıyor...")
        return True
    
    print("\n📦 Paketler kontrol ediliyor...")
    
    try:
        with open(requirements_file, 'r', encoding='utf-8') as f:
            requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    except Exception as e:
        print(f"⚠ requirements.txt okunamadı: {e}")
        return True
    
    missing_packages = []
    package_map = {
        'opencv-python': 'cv2',
        'pillow': 'PIL',
        'werkzeug': 'werkzeug',
        'flask': 'flask',
        'numpy': 'numpy',
        'pyinstaller': 'PyInstaller'
    }
    
    for requirement in requirements:
        package_name = requirement.split('>=')[0].split('==')[0].strip()
        import_name = package_map.get(package_name, package_name.replace('-', '_'))
        
        try:
            __import__(import_name)
            print(f"  ✓ {package_name} yüklü")
        except ImportError:
            print(f"  ✗ {package_name} bulunamadı")
            missing_packages.append(requirement)
    
    if missing_packages:
        print(f"\n📥 {len(missing_packages)} paket yükleniyor...")
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "-r", str(requirements_file), "--quiet"
            ])
            print("✓ Tüm paketler başarıyla yüklendi!")
            return True
        except subprocess.CalledProcessError as e:
            print(f"✗ Paket yükleme hatası: {e}")
            print("⚠ Bazı paketler eksik olabilir, devam ediliyor...")
            wait_for_user()
            return True
    
    print("✓ Tüm paketler yüklü!")
    return True

def start_flask_app():
    """Flask uygulamasını başlat"""
    print("\n🚀 Flask uygulaması başlatılıyor...")
    
    # Exe içindeyse çalışma dizinini ayarla
    if getattr(sys, 'frozen', False):
        # PyInstaller ile paketlenmiş
        base_path = Path(sys._MEIPASS)
        # Çalışma dizinini exe'nin bulunduğu yere ayarla (uploads için)
        exe_dir = Path(sys.executable).parent
        os.chdir(exe_dir)
        
        # Gerekli klasörleri oluştur (exe modunda exe_dir'de)
        uploads_dir = exe_dir / 'uploads'
        static_outputs_dir = exe_dir / 'static' / 'outputs'
        uploads_dir.mkdir(parents=True, exist_ok=True)
        static_outputs_dir.mkdir(parents=True, exist_ok=True)
    else:
        # Normal Python script
        base_path = Path(__file__).parent
        os.chdir(base_path)
        
        # Gerekli klasörleri oluştur
        for folder in ['uploads', 'static/outputs']:
            Path(folder).mkdir(parents=True, exist_ok=True)
    
    # app.py'yi import et
    try:
        # sys.path'e base_path ekle
        if str(base_path) not in sys.path:
            sys.path.insert(0, str(base_path))
        
        from app import app
        
        # Tarayıcıyı 2 saniye sonra aç (Flask'ın başlaması için)
        def open_browser():
            time.sleep(2)
            webbrowser.open('http://127.0.0.1:5000')
        
        import threading
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        print("✓ Tarayıcı açılıyor...")
        print("✓ Uygulama çalışıyor: http://127.0.0.1:5000")
        print("\n⚠ Uygulamayı kapatmak için pencereyi kapatın\n")
        
        # Flask'ı çalıştır
        try:
            app.run(host='127.0.0.1', port=5000, debug=False, use_reloader=False)
        finally:
            # Flask kapandığında temizlik
            cleanup_temp_folders()
        
    except ImportError as e:
        print(f"✗ app.py import hatası: {e}")
        import traceback
        traceback.print_exc()
        wait_for_user()
        return False
    except Exception as e:
        print(f"✗ Flask başlatma hatası: {e}")
        import traceback
        traceback.print_exc()
        wait_for_user()
        return False

def main():
    """Ana fonksiyon"""
    print("=" * 50)
    print("  Video ASCII Art Converter")
    print("=" * 50)
    
    # Exe modunda temizlik handler'larını kaydet
    if getattr(sys, 'frozen', False):
        atexit.register(cleanup_temp_folders)
        # Windows'ta signal handler'ları kaydet
        try:
            def signal_handler(signum, frame):
                cleanup_temp_folders()
                sys.exit(0)
            signal.signal(signal.SIGINT, signal_handler)
            signal.signal(signal.SIGTERM, signal_handler)
        except (AttributeError, ValueError):
            # Windows'ta bazı signal'lar desteklenmeyebilir
            pass
    
    # Python kontrolü (sadece normal modda)
    if not getattr(sys, 'frozen', False):
        if not check_python():
            print("\n✗ Python bulunamadı!")
            print("\nPython'u indirmek için:")
            print("https://www.python.org/downloads/")
            webbrowser.open('https://www.python.org/downloads/')
            wait_for_user()
            return
    
    # Paket kontrolü ve yükleme
    if not check_and_install_packages():
        print("\n✗ Paket kontrolü başarısız!")
        wait_for_user()
        return
    
    # Flask uygulamasını başlat
    try:
        start_flask_app()
    finally:
        # Flask kapandığında temizlik yap
        if getattr(sys, 'frozen', False):
            cleanup_temp_folders()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Uygulama kapatılıyor...")
        if getattr(sys, 'frozen', False):
            cleanup_temp_folders()
        time.sleep(2)
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Beklenmeyen hata: {e}")
        import traceback
        traceback.print_exc()
        if getattr(sys, 'frozen', False):
            cleanup_temp_folders()
        wait_for_user()
        sys.exit(1)
