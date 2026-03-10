# PESV Authentication & Integration Tests

Este directorio contiene todos los tests para validar la autenticación y la integración del sistema PESV.

## Estructura de Directorios

```
tests/
├── backend/          # Tests de backend directo
├── proxy/            # Tests de proxy del frontend
├── integration/      # Tests de integración completa
└── README.md         # Este archivo
```

## Prerrequisitos

Asegúrate de tener los siguientes servicios ejecutándose:

1. **Backend** (puerto 8081)
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

2. **Frontend** (puerto 3000)
   ```bash
   cd pesv (directorio raíz)
   npm install
   npm start
   ```

## Tests Disponibles

### 1. Backend Test (`backend/backend.test.js`)

Prueba la autenticación directa del backend usando HTTP Basic Auth.

**Qué prueba:**
- Conexión al servidor backend en puerto 8081
- Autenticación con credenciales admin:admin
- Response 200 OK desde /api/auth/me

**Cómo ejecutar:**
```bash
node tests/backend/backend.test.js
```

### 2. Proxy Test (`proxy/proxy.test.js`)

Verifica que el proxy del frontend está funcionando correctamente.

**Qué prueba:**
- Conexión al servidor frontend en puerto 3000
- Verificación del archivo setupProxy.js
- Redirección correcta de /api/* al backend
- Response 200 OK a través del proxy

**Cómo ejecutar:**
```bash
node tests/proxy/proxy.test.js
```

### 3. Integration Test (`integration/integration.test.js`)

Suite completa de 5 tests de integración para validar todo el sistema.

**Qué prueba:**
1. Backend disponible en puerto 8081
2. Frontend proxy disponible en puerto 3000
3. Autenticación con credenciales admin funciona
4. Spring Security acepta {noop} encoder para contraseñas en texto plano
5. CORS está configurado correctamente

**Cómo ejecutar:**
```bash
node tests/integration/integration.test.js
```

## Credenciales de Prueba

- **Admin**: `admin@pesv.co` / `admin`
- **User**: `user@pesv.co` / `user`

## Resolución de Problemas

### Error: "Backend unreachable"
- Verifica que el backend está ejecutándose en puerto 8081
- Comprueba que Maven compiló sin errores
- Ejecuta: `mvn clean install` desde el directorio `backend/`

### Error: "Frontend unreachable" o "CONNECTION ERROR"
- Verifica que el frontend está ejecutándose en puerto 3000
- Asegúrate de que `setupProxy.js` está en `src/` directory
- Comprueba que no hay errores en la consola de React

### Error: "Credentials rejected (401)"
- Verifica que Spring Security está usando {noop} encoder
- Comprueba el archivo `SecurityConfig.java` en el backend
- Las contraseñas deben ser exactamente `admin` y `user` (sin cambios)

## Flujo de Autenticación

```
Cliente → Frontend (puerto 3000)
              ↓
         setupProxy.js
              ↓
         Backend (puerto 8081)
              ↓
         Spring Security (authenticate)
              ↓
         AuthController.java (/api/auth/me)
              ↓
         JSON Response
         {
           "id": "...",
           "nombre": "...",
           "email": "...@pesv.co",
           "role": "administrador|usuario"
         }
```

## Notas Importantes

- Los tests usan HTTP Basic Auth con credenciales en Base64
- CORS debe estar habilitado en el backend para que funcione el proxy del frontend
- Los tests esperan response 200 OK para un resultado exitoso
- El {noop} encoder en Spring Security es SOLO para desarrollo/demo

## Mantenimiento

Para agregar nuevos tests:

1. Crea un nuevo archivo en el directorio apropiado
2. Sigue el patrón de los tests existentes
3. Usa la utilidad `log()` para consistencia en los mensajes
4. Documenta el propósito del test en este README
