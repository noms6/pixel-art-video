@echo off
REM Bu script exe kapandıktan sonra temizlik yapar
timeout /t 2 /nobreak >nul
if exist "uploads" rmdir /s /q "uploads" 2>nul
if exist "static" rmdir /s /q "static" 2>nul

