# PESV Backend (Spring Boot) - Demo

Mini backend demo para la presentación. Contiene endpoints para calcular rutas usando Google Directions y un adaptador de Waze simulado.

Run:

1. Configurar `GOOGLE_MAPS_API_KEY` como variable de entorno o editar `application.properties`.

2. Desde la carpeta `backend` ejecutar:

```bash
mvn spring-boot:run
```

Credenciales demo (HTTP Basic):

- admin/admin (ROLE_ADMIN)
- user/user (ROLE_USER)

Endpoints principales:

- POST `/api/users/{userId}/routes/calc` body: `{ "originLat":..., "originLng":..., "destLat":..., "destLng":... }` query param `provider` (google|waze)
- GET `/api/admin/users` (admin)
- GET `/api/admin/users/{userId}/routes` (admin)

Notas:

- `GoogleMapsRoutingProvider` usa la API Directions. Añade tu `GOOGLE_MAPS_API_KEY`.
- `WazeRoutingProviderStub` es una implementación simulada; reemplazar con una integración real de Waze según credenciales/SDK disponibles.
