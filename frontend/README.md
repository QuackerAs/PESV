# PESV Frontend

Aplicación web React para la gestión integral de Seguridad Vial.

## 🚀 Inicio Rápido

### Requisitos
- **Node.js** v14+
- **Backend** corriendo en `http://localhost:8081`

### Instalación y Ejecución

```bash
npm install
npm start
```

La app abre automáticamente en **http://localhost:3000**

## 🔐 Credenciales

```
admin@pesv.co / admin    (Administrador)
user@pesv.co / user      (Usuario)
```

## 📁 Estructura

```
src/
├── components/       # Componentes reutilizables
├── context/          # Estado global (AuthContext)
├── pages/            # Páginas de la aplicación
├── services/         # Cliente HTTP (api.js)
├── styles/           # CSS global
├── setupProxy.js     # Proxy /api → backend
└── App.js            # Rutas principales
```

## 📦 Dependencias Principales

- **React** 18.2.0 - Librería UI
- **React Router** 6.20.0 - Enrutamiento
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## 📝 Scripts

```bash
npm start         # Desarrollo con hot-reload
npm run build     # Compilar para producción
npm test          # Tests
npm run cap:sync  # Sincronizar con Android (Capacitor)
```

## 🎨 Colores Principales

- Azul: `#2563EB`
- Verde: `#059669`
- Rojo: `#DC2626`

## 🤖 Capacitor/Android

```bash
npm run cap:sync    # Sincronizar cambios web
npm run cap:open    # Abrir Android Studio
npm run cap:build   # Compilar APK
```

## 📄 Licencia

© 2026 PESV. Todos los derechos reservados.
