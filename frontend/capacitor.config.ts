import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.pesv.app',
  appName: 'pesv-android',
  webDir: 'build',
  // la plataforma de Android está en la raíz del repositorio, por eso se indica la ruta
  android: {
    path: '../android'
  }
};

export default config;
