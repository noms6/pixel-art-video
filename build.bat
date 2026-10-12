@echo off
chcp 65001 >nul
echo ========================================
echo   Pixel Art Video - EXE Build
echo ========================================
echo.
python --version >nul 2>&1
if errorlevel 1 (
    echo [HATA] Python bulunamadi: https://www.python.org/downloads/
    pause
    exit /b 1
)
python -m pip install -q -r requirements-dev.txt || goto :fail
python build_exe.py %* || goto :fail
echo.
echo   Tamamlandi: dist\VideoASCIIArtConverter\VideoASCIIArtConverter.exe
echo   (Klasorun tamamini birlikte tasiyin.)
pause
exit /b 0
:fail
echo [HATA] Build basarisiz.
pause
exit /b 1
