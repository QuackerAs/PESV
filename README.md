# PESV — Sistema de Gestión de Seguridad Vial

PESV es una aplicación en desarrollo que reúne una interfaz web en React y una API en Spring Boot para explorar flujos relacionados con usuarios, rutas y seguimiento básico. El repositorio también contiene una configuración de Capacitor para Android.

> **Estado:** proyecto de desarrollo/demostración. La presencia del código y de instrucciones de compilación no implica que la aplicación esté desplegada, haya superado una auditoría de seguridad, tenga todas sus funciones integradas o sea apta para operar en un entorno real. No usar para tomar decisiones operativas de seguridad vial sin validación técnica, funcional y normativa.

## Contenido

- [Alcance actual](#alcance-actual)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Credenciales de demostración](#credenciales-de-demostración)
- [Configuración](#configuración)
- [Endpoints identificados](#endpoints-identificados)
- [Pruebas disponibles](#pruebas-disponibles)
- [Android con Capacitor](#android-con-capacitor)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Limitaciones y consideraciones de seguridad](#limitaciones-y-consideraciones-de-seguridad)
- [Despliegue](#despliegue)
- [Documentación adicional](#documentación-adicional)
- [Licencia](#licencia)

## Alcance actual

El código disponible incluye:

- Una interfaz web construida con React, con navegación y vistas diferenciadas para administración y usuarios.
- Un backend REST con Spring Boot y Spring Security.
- Autenticación de demostración mediante HTTP Basic.
- Endpoints para consultar la identidad autenticada, listar usuarios y rutas desde el ámbito administrativo, asignar rutas, calcular rutas, consultar la ruta activa, recibir telemetría y registrar emergencias.
- Un proveedor de rutas basado en Google Directions que requiere una clave válida.
- Una implementación simulada para la opción denominada `waze`; no es una integración oficial con Waze ni proporciona datos reales de tráfico.
- Una configuración de Capacitor y un proyecto Android en el repositorio.

La existencia de una vista en el frontend no garantiza por sí sola que exista una API equivalente, que la función esté integrada de extremo a extremo o que los datos se conserven. Revisa los controladores y servicios del backend antes de depender de una funcionalidad específica.

## Tecnologías

| Componente | Tecnología | Versión declarada o configuración |
|---|---|---|
| Interfaz web | React | `^18.2.0` |
| Navegación | React Router | `^6.20.0` |
| Cliente HTTP | Axios | `^1.7.2` |
| Mapas e iconos | Leaflet, React Leaflet, Lucide React | Según `frontend/package.json` |
| Herramientas frontend | Create React App / `react-scripts` | `5.0.1` |
| Aplicación móvil | Capacitor | `^8.0.2` |
| API | Spring Boot | `3.1.4` |
| Seguridad | Spring Security | Gestionada por Spring Boot |
| Persistencia | Spring Data JPA y H2 | H2 configurada en memoria |
| Lenguaje backend | Java | `17` |
| Construcción backend | Maven | Instalación local requerida |

Las versiones anteriores reflejan la configuración declarada en el repositorio, no una certificación de que todas las dependencias estén actualizadas o sean adecuadas para producción.

## Requisitos

Para ejecutar la aplicación web y el backend:

- Git.
- Node.js y npm. Para trabajar con la configuración actual de Capacitor 8, se requiere **Node.js 22 o superior**.
- Java Development Kit (JDK) 17 o compatible con la configuración del backend.
- Maven instalado y disponible en el PATH.

Para compilar o ejecutar la app Android también se requiere Android Studio y un Android SDK compatible. Consulta la [guía oficial de entorno de Capacitor](https://capacitorjs.com/docs/getting-started/environment-setup) para conocer los requisitos de la versión instalada.

Para calcular rutas con Google se necesita una clave válida de Google Maps Directions API. Sin ella, la solicitud al proveedor Google puede fallar. La opción `waze` es simulada y no requiere ni consulta una cuenta de Waze.

## Instalación y ejecución local

### 1. Clonar el repositorio

\`\`\`bash
git clone https://github.com/QuackerAs/PESV.git
cd PESV
\`\`\`

### 2. Instalar dependencias del frontend

Desde la raíz del repositorio:

\`\`\`bash
cd frontend
npm ci
\`\`\`

El archivo `package-lock.json` se utiliza para instalar las versiones bloqueadas. Si no vas a trabajar con el proyecto Android, puedes ejecutar únicamente el frontend web y el backend.

### 3. Iniciar el backend

En una terminal:

\`\`\`bash
cd backend
mvn clean install
mvn spring-boot:run
\`\`\`

La configuración actual indica que Spring Boot escucha en [http://localhost:8081](http://localhost:8081).

### 4. Iniciar el frontend

En otra terminal, desde la raíz del repositorio:

\`\`\`bash
cd frontend
npm start
\`\`\`

Create React App normalmente sirve el frontend de desarrollo en [http://localhost:3000](http://localhost:3000). Si el puerto está ocupado, puede solicitar otro puerto.

El archivo `frontend/src/setupProxy.js` configura un proxy de desarrollo que reenvía las solicitudes que empiezan por `/api` a `http://localhost:8081`. Esta configuración se usa con `npm start`; no es una configuración de proxy de producción.

Inicia primero el backend y después el frontend. Las instrucciones anteriores describen el arranque local; no certifican una instalación en otro entorno.

## Credenciales de demostración

Las siguientes credenciales están definidas para la configuración de demostración del backend:

| Acceso desde la interfaz | Contraseña | Rol asignado por el backend |
|---|---|---|
| `admin@pesv.co` | `admin` | Administrador |
| `user@pesv.co` | `user` | Usuario |

El frontend elimina la parte del correo situada después de `@` antes de crear la cabecera de autenticación. Por eso, en el backend las cuentas se denominan realmente `admin` y `user`. Para llamadas directas a la API mediante HTTP Basic, usa esos nombres de usuario, no el correo completo.

**Estas son credenciales públicas de demostración; no son cuentas seguras para un servicio expuesto a Internet.** No reutilices estas contraseñas ni las habilites en una instalación real.

## Configuración

### URL de la API

El cliente Axios lee `REACT_APP_API_URL` y, si no está definida, usa `/api`. Para el desarrollo local, el valor predeterminado permite utilizar el proxy de `frontend/src/setupProxy.js`.

Puedes crear `frontend/.env` para personalizar el frontend. Por ejemplo:

\`\`\`env
REACT_APP_API_URL=/api
\`\`\`

Las variables `REACT_APP_*` se incorporan al bundle durante la compilación del frontend; no deben contener secretos.

### Clave de Google Maps

La propiedad que consulta el proveedor Google está declarada como `google.api.key` en el backend. Su valor predeterminado está vacío en `backend/src/main/resources/application.properties`.

Configura una clave válida mediante una propiedad de Spring o una configuración local no versionada. No publiques claves privadas en el repositorio ni en el código del frontend. Revisa también los permisos, las restricciones y la facturación de la clave según las condiciones de Google Maps Platform.

### Base de datos

La configuración actual utiliza H2 en memoria con la URL `jdbc:h2:mem:pesvdb`. Por tanto, los datos son temporales y no deben considerarse persistentes entre reinicios del proceso. La consola H2 está habilitada en la configuración del backend; no la expongas en un entorno público.

## Endpoints identificados

Los controladores del backend contienen, entre otros, los siguientes endpoints:

| Método | Ruta | Propósito observado |
|---|---|---|
| `GET` | `/api/auth/me` | Devuelve los datos del usuario autenticado |
| `GET` | `/api/admin/users` | Lista usuarios; requiere rol de administrador |
| `GET` | `/api/admin/users/{userId}/routes` | Lista rutas de un usuario; requiere rol de administrador |
| `POST` | `/api/admin/users/{userId}/routes/{routeId}/assign` | Asigna una ruta de las existentes para ese usuario |
| `POST` | `/api/users/{userId}/routes/calc` | Calcula y guarda una ruta; acepta `provider` como parámetro |
| `GET` | `/api/users/{userId}/active-route` | Consulta la ruta marcada como activa/asignada |
| `POST` | `/api/users/{userId}/telemetry` | Actualiza latitud, longitud y velocidad de la ruta activa |
| `POST` | `/api/users/{userId}/emergency` | Registra una emergencia con ubicación y descripción |

Esta tabla documenta rutas encontradas en el código, no una API estable ni una garantía de que todos los flujos estén protegidos o validados de forma suficiente. Consulta los controladores para conocer los cuerpos de solicitud esperados y el comportamiento exacto.

Ejemplo de cuerpo para calcular una ruta:

\`\`\`json
{
  "originLat": 4.711,
  "originLng": -74.0721,
  "destLat": 4.6486,
  "destLng": -74.2479
}
\`\`\`

La solicitud se envía a `POST /api/users/{userId}/routes/calc?provider=google`. Las coordenadas del ejemplo son ilustrativas. El proveedor Google necesita una clave configurada y la opción `provider=waze` usa una aproximación simulada, no rutas reales de Waze.

## Pruebas disponibles

El repositorio contiene scripts manuales de prueba en `tests/`:

\`\`\`bash
# Desde la raíz del repositorio, con Node.js instalado
node tests/backend/backend.test.js
node tests/proxy/proxy.test.js
node tests/integration/integration.test.js
\`\`\`

- La prueba de backend necesita el backend ejecutándose en el puerto 8081.
- La prueba del proxy necesita el frontend de desarrollo ejecutándose y el backend accesible.
- La prueba de integración comprueba varios flujos entre frontend y backend y también requiere los servicios correspondientes.

Estos scripts no equivalen a una suite de aceptación exhaustiva, pruebas de carga, auditoría de seguridad ni certificación de funcionamiento. No se afirma aquí que hayan sido ejecutados o que pasen en todos los entornos. El `frontend/package.json` actual no define un script `npm test`.

Consulta [tests/README.md](./tests/README.md) para ver las notas adicionales de las pruebas.

## Android con Capacitor

La configuración de Capacitor está en `frontend/capacitor.config.ts` y el proyecto Android está en la carpeta raíz `android/`. Los siguientes scripts están declarados en `frontend/package.json`:

\`\`\`bash
cd frontend

# Generar el build web y sincronizar los archivos con Android
npm run cap:sync

# Abrir el proyecto Android en Android Studio
npm run cap:open

# Ejecutar el script de compilación del APK de release
npm run cap:build
\`\`\`

La compilación depende de que Android Studio, el SDK, Gradle y el entorno local estén configurados correctamente. Que exista un script no implica que el APK se haya compilado, firmado, probado o publicado. La generación de una versión de distribución requiere además revisar la configuración de firma y los requisitos de publicación.

Hay scripts auxiliares en `frontend/`, como `build-and-install.sh` y `build-install-debug.bat`. Revisa su contenido antes de ejecutarlos; algunos están orientados a sistemas operativos y herramientas específicos.

## Estructura del repositorio

\`\`\`text
PESV/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── setupProxy.js
│   ├── scripts/
│   ├── capacitor.config.ts
│   ├── package.json
│   └── README.md
├── backend/
│   ├── src/main/java/com/example/pesv/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── routing/
│   │   └── service/
│   ├── src/main/resources/
│   ├── pom.xml
│   └── README.md
├── android/
├── tests/
│   ├── backend/
│   ├── proxy/
│   ├── integration/
│   └── README.md
└── README.md
\`\`\`

## Limitaciones y consideraciones de seguridad

La configuración que hay en el repositorio es de demostración. Antes de cualquier uso real o despliegue público, deben revisarse y corregirse, como mínimo, los siguientes puntos:

1. **Autenticación:** Spring Security define usuarios en memoria y contraseñas con el codificador `{noop}`. Esto no es adecuado para producción.
2. **Registro de credenciales:** el archivo `frontend/src/services/api.js` contiene mensajes de consola que imprimen las credenciales introducidas y su representación codificada en Base64 durante el inicio de sesión. Deben eliminarse o reemplazarse por registros que nunca incluyan secretos antes de probar con usuarios reales.
3. **Almacenamiento del acceso:** el cliente guarda el valor de autorización en `localStorage`. Esto aumenta la exposición ante vulnerabilidades de JavaScript, como XSS.
4. **HTTP Basic:** Base64 no cifra las credenciales. Cualquier tráfico remoto debe protegerse con HTTPS; además, debe revisarse el diseño de autenticación para producción.
5. **Protecciones web:** la configuración actual deshabilita CSRF para las rutas de API. Deben revisarse el modelo de sesión, la autenticación, la autorización y las protecciones adecuadas al despliegue.
6. **Persistencia:** H2 está configurada en memoria. No hay que asumir persistencia, copias de seguridad o recuperación de datos.
7. **Acceso a endpoints:** se debe auditar la autorización por usuario y por recurso, la validación de entradas, los controles de acceso y el tratamiento de errores. Que un endpoint exista no garantiza que esté protegido de forma suficiente.
8. **Dependencias y framework:** Spring Boot está fijado en la rama 3.1.4. Revisa la política de soporte y actualiza a una versión mantenida antes de exponer el sistema.
9. **Servicios externos:** configura las claves de API fuera del código, con permisos mínimos y restricciones apropiadas. El proveedor Waze de este repositorio es un stub.
10. **Validación funcional y normativa:** no se documentan aquí resultados de auditoría independiente, pruebas exhaustivas, certificaciones, cumplimiento normativo ni validación para operación real.

## Despliegue

Este repositorio no incluye una configuración de despliegue que permita afirmar que el sistema esté listo para producción. No se proporcionan aquí garantías de disponibilidad, escalabilidad, endurecimiento de infraestructura ni publicación de una versión móvil.

Antes de desplegar, define y valida por separado: entorno y secretos; HTTPS; autenticación y autorización de producción; base de datos persistente con copias de seguridad; configuración CORS si frontend y API usan distintos orígenes; observabilidad sin datos sensibles; pruebas automatizadas; gestión de errores; política de actualizaciones; y requisitos legales y de privacidad aplicables.

## Documentación adicional

- [README del frontend](./frontend/README.md)
- [README del backend](./backend/README.md)
- [README de pruebas](./tests/README.md)
- [Guía de integración móvil](./frontend/mobile-integration.md)
- [Documentación de Capacitor](https://capacitorjs.com/docs)
- [Entorno de desarrollo de Capacitor](https://capacitorjs.com/docs/getting-started/environment-setup)

## Licencia

No se identifica un archivo `LICENSE` en la raíz del repositorio. No debe asumirse que el código se ofrece bajo una licencia de software libre o que está autorizada su redistribución. Consulta al titular del repositorio antes de reutilizarlo o distribuirlo.
