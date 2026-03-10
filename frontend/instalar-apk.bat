@echo off
REM Script para instalar el APK en un dispositivo Android conectado
REM Uso: instalar-apk.bat

setlocal enabledelayedexpansion

REM script located in frontend; android folder lives at repo root
set APK_PATH=%~dp0..\android\app\build\outputs\apk\release\app-release.apk

if not exist "%APK_PATH%" (
    echo.
    echo ❌ Error: No se encontró el APK
    echo.
    echo Primero necesitas compilar el APK:
    echo   npm run cap:build
    echo.
    pause
    exit /b 1
)

echo.
echo 📱 Buscando dispositivos Android...
echo.
adb devices

echo.
echo 📦 Instalando la aplicación...
echo.

adb install -r "%APK_PATH%"

echo.
echo ✅ ¡Instalación completada!
echo.
pause
