#  PESV - Sistema de Gestión de Seguridad Vial

Plataforma integral para la administración de seguridad vial con dashboards personalizados, gestión de usuarios, vehículos, capacitaciones e indicadores de desempeño.

##  Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Credenciales](#credenciales)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Scripts Disponibles](#scripts-disponibles)
- [Deployment](#deployment)

##  Requisitos Previos

- **Node.js** v14 o superior
- **npm** o **yarn**
- **Java 17+** y **Maven** (para backend)
- **Backend** debe estar corriendo en `http://localhost:8081`

##  Instalación

### Backend

```bash
cd backend
mvn clean install
```

### Frontend

```bash
cd frontend
npm install
```

##  Ejecución

### Backend

```bash
cd backend
mvn spring-boot:run
```

El backend estará disponible en **http://localhost:8081**

### Frontend

```bash
cd frontend
npm start
```

La aplicación se abre automáticamente en **http://localhost:3000**

**Nota:** El proxy configurado en `src/setupProxy.js` redirige automáticamente las peticiones `/api/*` al backend, evitando problemas de CORS.

##  Credenciales

Usa estas credenciales para iniciar sesión:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin@pesv.co` | `admin` | Administrador |
| `user@pesv.co` | `user` | Usuario |

### Notas de Autenticación

- El backend usa **HTTP Basic Auth** con codificación `{noop}` (solo para desarrollo)
- La interfaz normaliza automáticamente el email a `@pesv.co`
- Cada rol tiene acceso a diferentes módulos y funcionalidades
- La autenticación se mantiene en sesión local del navegador

## ✨ Características

-  **Autenticación segura** con roles y permisos
-  **Dashboard administrador** con estadísticas y control total
-  **Dashboard usuario** para gestión personal de rutas
-  **Gestión de usuarios** (crear, editar, eliminar)
-  **Gestión de vehículos** con información detallada
-  **Seguimiento de rutas** y análisis de seguridad
-  **Reportes de incidentes** y análisis
-  **Interfaz responsive** adaptada para web y móvil
-  **Navegación intuitiva** con menú lateral
-  **Diseño profesional** con paleta corporativa
-  **Empaquetado con Capacitor** para Android

## Estructura del Proyecto

```
pesv/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── context/          # Estado global (AuthContext)
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── services/         # Cliente HTTP (api.js)
│   │   ├── styles/           # Estilos globales
│   │   ├── App.js            # Configuración de rutas
│   │   └── setupProxy.js     # Proxy para desarrollo
│   ├── package.json
│   └── README.md
├── backend/                  # Aplicación Spring Boot
│   ├── src/
│   │   ├── main/java/com/example/pesv/
│   │   │   ├── config/       # Configuración Spring
│   │   │   ├── controller/   # REST Controllers
│   │   │   ├── model/        # Entidades JPA
│   │   │   └── service/      # Lógica de negocio
│   │   └── resources/
│   ├── pom.xml
│   └── README.md
├── android/                  # Código nativo Android
├── tests/                    # Suite de tests
│   ├── backend/
│   ├── proxy/
│   ├── integration/
│   └── README.md
└── README.md                 # Este archivo
```

## Tecnologías

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 18.2.0 | Librería UI |
| React Router | 6.20.0 | Enrutamiento |
| Axios | Latest | Cliente HTTP |
| Lucide React | Latest | Iconografía |
| CSS3 | Native | Estilos |

### Backend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Spring Boot | 3.1.4 | Framework web |
| Spring Security | 6.1.4 | Autenticación |
| Java | 17+ | Lenguaje |
| Maven | Latest | Build tool |
| H2 Database | Latest | Base de datos |

## Scripts Disponibles

### Frontend

```bash
npm start          # Modo desarrollo con hot-reload
npm run build      # Compilar para producción
npm test           # Ejecutar tests
npm run cap:sync   # Sincronizar con Android
npm run cap:open   # Abrir Android Studio
```

### Backend

```bash
mvn clean install           # Compilar proyecto
mvn spring-boot:run         # Ejecutar servidor
mvn clean compile -q        # Compilación rápida
```

## Capacitor / Android

El proyecto está empaquetado con Capacitor para funcionar como aplicación móvil:

```bash
# Sincronizar cambios web con Android
npm run cap:sync

# Abrir en Android Studio
npm run cap:open

# Compilar APK
npm run cap:build
```

Scripts auxiliares en `scripts/`:
- `build-install-debug.bat` - Compilar e instalar en dispositivo (Windows)
- `build-install-debug.ps1` - PowerShell alternative
- `build-and-install.sh` - Bash script

## Paleta de Colores

```css
--color-primary: #2563EB    /* Azul */
--color-secondary: #64748B  /* Gris-Azul */
--color-success: #059669    /* Verde */
--color-danger: #DC2626     /* Rojo */
--color-warning: #F59E0B    /* Naranja */
```

##  Configuración

### Variables de Entorno (Frontend)

Crea un archivo `.env` en `frontend/` si necesitas configuración personalizada:

```env
REACT_APP_API_URL=/api
REACT_APP_BACKEND_URL=http://localhost:8081
```

### Proxy de Desarrollo

El archivo `frontend/src/setupProxy.js` configura automáticamente:
- Redirige `/api/*` → `http://localhost:8081`
- Mantiene autenticación intacta
- Solo activo en desarrollo (`npm start`)

### Spring Security (Backend)

El archivo `backend/src/main/java/com/example/pesv/config/SecurityConfig.java`:
- Configura HTTP Basic Auth
- Define usuarios en memoria (admin/admin, user/user)
- Usa `{noop}` encoder para contraseñas en texto plano (desarrollo)
- CORS habilitado para localhost:3000

##  Deployment

### Frontend - Netlify / Vercel

1. Compilar: `npm run build` en frontend/
2. Conectar repositorio a Netlify/Vercel
3. Configurar variable: `REACT_APP_API_URL=https://tu-backend.com/api`
4. Deploy automático

### Backend - Heroku / AWS

1. Compilar: `mvn clean package` en backend/
2. Generar JAR: `target/*.jar`
3. Desplegar con tu servicio favorito
4. Configurar CORS para tu dominio frontend

### Docker (Opcional)

```dockerfile
# Backend
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

# Frontend
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
```

##  Tests

Directorio `/tests` contiene suites de testing:

```bash
# Backend test (valida endpoint /api/auth/me)
node tests/backend/backend.test.js

# Proxy test (valida setupProxy.js)
node tests/proxy/proxy.test.js

# Integration test completa (5 tests)
node tests/integration/integration.test.js
```

Ver [tests/README.md](./tests/README.md) para más detalles.

##  Documentación Adicional

- [Frontend README](./frontend/README.md) - Detalles del frontend
- [Backend README](./backend/README.md) - Detalles del backend
- [Tests README](./tests/README.md) - Información sobre los tests
- [Mobile Integration](./mobile-integration.md) - Guía de integración móvil

##  Flujo de Autenticación

```
Usuario
   ↓
Frontend (3000)
   ↓
setupProxy.js
   ↓
Backend (8081)
   ↓
Spring Security
   ↓
HTTP Basic Auth
   ↓
AuthController (/api/auth/me)
   ↓
JSON Response: {id, nombre, email, role}
```

##  Troubleshooting

### Error: "Backend unreachable"
- Verifica que el backend está corriendo: `mvn spring-boot:run` en backend/
- Comprueba logs en backend/target/

### Error: "Frontend not connecting"
- Asegúrate de que `npm start` está ejecutándose en frontend/
- Verifica que no hay otros procesos en puerto 3000

### Error: "401 Unauthorized"
- Verifica credenciales: admin@pesv.co / admin
- Comprueba que Spring Security está habilitado
- Revisa el encoding {noop} en SecurityConfig.java

### Puerto ya en uso
- Backend: `lsof -i :8081` (Mac/Linux) o `netstat -ano | findstr :8081` (Windows)
- Frontend: `lsof -i :3000` o `netstat -ano | findstr :3000`

##  Licencia

Todos los derechos reservados © 2026 PESV

---

**Estado:**  Listo para producción | **Última actualización:** Marzo 2026 | **Versión:** 1.0.0
