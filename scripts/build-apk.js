// build-apk.js - Script para compilar el APK
// Ejecuta: node scripts/build-apk.js

const { spawn } = require('child_process');
const path = require('path');

const projectRoot = __dirname + '/..';
const androidDir = path.join(projectRoot, 'android');

console.log('🔨 Iniciando compilación del APK...\n');

// Usar gradlew directamente
const gradleCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

const gradle = spawn(gradleCmd, ['assembleRelease'], {
    cwd: androidDir,
    stdio: 'inherit',
    shell: true
});

gradle.on('close', (code) => {
    if (code === 0) {
        console.log('\n✅ ¡APK compilado exitosamente!');
        console.log(`📦 Ubicación: ${path.join(androidDir, 'app/build/outputs/apk/release/app-release.apk')}`);
    } else {
        console.log('\n❌ Error durante la compilación');
        process.exit(1);
    }
});
