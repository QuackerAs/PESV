# Integración móvil (backend)

Notas rápidas para integrar la app móvil (Capacitor / WebView) con este backend demo.

- URL base: `http://<host>:8081/api` (por defecto `localhost:8081` para desarrollo)
- Autenticación: demo usa HTTP Basic (username/password) — se envía en la cabecera `Authorization: Basic <base64>`.
- Endpoints útiles:
  - `POST /api/users/{userId}/routes/calc` -> calcula y guarda ruta para el usuario (body: originLat, originLng, destLat, destLng). Query param `provider=google|waze`.
  - `GET /api/admin/users/{userId}/routes` -> listas de rutas (requiere rol ADMIN)
  - `GET /api/auth/me` -> devuelve información básica del usuario autenticado

- CORS: el backend incluye un filtro CORS que permite orígenes para demo. Para producción restringe `AllowedOrigins`.
- Authorization header: Asegúrate de enviar `Authorization` en las peticiones desde la app móvil; el filtro CORS ya expone `Authorization`.

Recomendaciones para producción/mobile:
- Usar tokens (JWT) en lugar de Basic auth.
- Servir con HTTPS y restringir orígenes.
- Para Capacitor: el WebView suele usar `http://localhost` como origen; el filtro CORS permite patrones, por eso funciona en desarrollo.
