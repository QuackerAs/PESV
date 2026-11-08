# PESV

Proyecto de portafolio para mostrar una aplicación de gestión de seguridad vial construida como una experiencia web y Android local.

## Stack

- React 18 y React Router
- Spring Boot, Spring Security y H2
- Capacitor para Android
- Bootstrap Icons y preferencias de accesibilidad
- GitHub Actions para validación continua

## Funcionalidades demostradas

- Paneles diferenciados para administración y usuarios.
- Gestión de rutas, telemetría e incidencias con datos de demostración.
- Control de acceso por rol y por propietario del recurso.
- Preferencias de interfaz: tema, contraste, tamaño de texto, fuente de lectura y movimiento reducido.
- Interfaz responsive compartida entre web y Android mediante Capacitor.

## Ejecutar localmente

Requisitos: Node.js 22+, JDK 17 y Maven. Android Studio solo es necesario para abrir o compilar el proyecto Android.

```bash
# API
cd backend
mvn spring-boot:run

# interfaz web
cd frontend
npm ci
npm start
```

El frontend se abre normalmente en `http://localhost:3000` y usa el backend local en el puerto `8081`.

## Validación

```bash
mvn -B -f backend/pom.xml verify

cd frontend
npm test -- --watchAll=false
npm run build
```

GitHub Actions ejecuta pruebas, build y comprobaciones de higiene en cada `push` y `pull request`.

## Android

```bash
cd frontend
npm run cap:sync
npm run cap:open
```

`cap:sync` genera el build web y lo copia al proyecto Android.

## Alcance

PESV es una demostración local para portafolio. No incluye hosting, integración de mapas ni una configuración pensada para operación real.
