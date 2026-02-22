@echo off
REM scripts\build-install-debug.bat - Build and install debug APK on Windows

echo 🔧 Building React (production build for assets...)
npm run build
if %errorlevel% neq 0 goto :err

echo 🔁 Copying web assets to Android project...
npx cap copy android
if %errorlevel% neq 0 goto :err

echo 🔨 Building debug APK...
cd android
if exist gradlew.bat (
  gradlew.bat assembleDebug
) else (
  echo gradlew.bat not found
  goto :err
)
cd ..

set APKPATH=android\app\build\outputs\apk\debug\app-debug.apk
echo 📦 Installing APK on connected device/emulator...
adb install -r %APKPATH%
if %errorlevel% neq 0 goto :err

echo ✅ Done. APK installed.
goto :eof

:err
echo ❌ An error occurred.
pause
exit /b 1
