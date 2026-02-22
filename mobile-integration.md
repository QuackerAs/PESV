# Integración móvil (frontend)

Guía rápida para que la app móvil (Capacitor / Ionic) consuma el frontend y el backend:

- El frontend (esta app React) debe enviar la cabecera `Authorization` en cada petición. En desarrollo usamos Basic auth (guardado en `localStorage.token`).
- Orígenes comunes que deben permitirse en el backend: `http://localhost:3000` (web), `http://localhost` y `capacitor://localhost` (Capacitor), `ionic://localhost`, `file://`.
- Endpoints principales para mobile:
  - `POST /api/users/{userId}/routes/calc` — calcular ruta.
  - `GET /api/auth/me` — obtener usuario autenticado.

Notas prácticas:
- Para llamadas desde la app nativa, usa fetch/axios y adjunta `Authorization` tal cual (p. ej. `Basic xxxx`).
- En producción cambia a HTTPS y considera migrar a JWT para evitar enviar credenciales crudas.
