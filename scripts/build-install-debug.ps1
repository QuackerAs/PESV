# scripts\build-install-debug.ps1 - PowerShell helper
# Usage: Open PowerShell in project root and run: .\scripts\build-install-debug.ps1

$ErrorActionPreference = 'Stop'

Write-Host "🔧 Building React (production build for assets)..."
npm run build

Write-Host "🔁 Copying web assets to Android project..."
npx cap copy android

Write-Host "🔨 Building debug APK..."
Push-Location android
if (Test-Path "gradlew.bat") {
    .\gradlew.bat assembleDebug
} else {
    Write-Error "gradlew.bat not found in android/"
}
Pop-Location

$apk = Join-Path -Path (Get-Location) -ChildPath "android\app\build\outputs\apk\debug\app-debug.apk"
if (-Not (Test-Path $apk)) {
    $apk = "android\app\build\outputs\apk\debug\app-debug.apk"
}

Write-Host "📦 Installing APK on connected device/emulator..."
adb install -r $apk

Write-Host "✅ Done. APK installed."
