@echo off
chcp 65001 >nul
echo ========================================
echo   Video ASCII Art Converter - EXE Build
echo ========================================
echo.

REM Python kontrolü
python --version >nul 2>&1
if errorlevel 1 (
    echo [HATA] Python bulunamadı!
    echo Python'u yükleyin: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python bulundu
echo.

REM PyInstaller yükleme
echo PyInstaller kontrol ediliyor...
python -m pip show pyinstaller >nul 2>&1
if errorlevel 1 (
    echo PyInstaller yükleniyor...
    python -m pip install pyinstaller
)

echo.
echo Exe oluşturuluyor...
echo.

REM Exe oluştur
python build_exe.py

echo.
echo ========================================
echo   Build tamamlandı!
echo   Exe dosyası: dist\VideoASCIIArtConverter.exe
echo ========================================
pause

