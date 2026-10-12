@echo off
chcp 65001 >nul
echo Video ASCII Art Converter başlatılıyor...
start /wait "" "%~dp0VideoASCIIArtConverter.exe"
echo Temizlik yapılıyor...
call "%~dp0cleanup.bat"

