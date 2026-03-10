#!/usr/bin/env bash
# Script rápido para compilar y instalar APK en Android
# Uso: bash scripts/build-and-install.sh

echo "🚀 PESV Android Build & Install Script"
echo "======================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Paso 1: Build de React
echo -e "${BLUE}📦 Paso 1: Compilando aplicación React...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error en build de React"
    exit 1
fi
echo -e "${GREEN}✅ React compilado${NC}\n"

# Paso 2: Sincronizar con Android
echo -e "${BLUE}🔄 Paso 2: Sincronizando con Android...${NC}"
npx cap sync android
if [ $? -ne 0 ]; then
    echo "❌ Error en sincronización"
    exit 1
fi
echo -e "${GREEN}✅ Sincronización completada${NC}\n"

# Paso 3: Compilar APK
echo -e "${BLUE}🔨 Paso 3: Compilando APK...${NC}"
cd ../android
chmod +x gradlew
./gradlew assembleRelease
if [ $? -ne 0 ]; then
    echo "❌ Error en compilación de Gradle"
    cd ..
    exit 1
fi
cd ..
echo -e "${GREEN}✅ APK compilado exitosamente${NC}\n"

APK_PATH="android/app/build/outputs/apk/release/app-release.apk"

if [ -f "$APK_PATH" ]; then
    echo -e "${GREEN}✅ APK encontrado en: $APK_PATH${NC}\n"
    
    # Paso 4: Instalar en dispositivo
    echo -e "${YELLOW}Dispositivos disponibles:${NC}"
    adb devices
    echo ""
    
    read -p "¿Instalar APK en dispositivo? (s/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${BLUE}📲 Instalando APK...${NC}"
        adb install -r "$APK_PATH"
        echo -e "${GREEN}✅ ¡APK instalado exitosamente!${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  APK no encontrado${NC}"
    echo "Verifica que Android SDK esté configurado correctamente"
fi

echo ""
echo -e "${GREEN}🎉 ¡Proceso completado!${NC}"
