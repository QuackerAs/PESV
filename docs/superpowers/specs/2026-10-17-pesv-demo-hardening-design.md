# Diseño: endurecimiento de la demo PESV

## Propósito

PESV seguirá siendo una demo local para presentar gestión básica de rutas, telemetría y emergencias. El objetivo es que sus datos, pantallas y controles no se contradigan durante una demostración.

No se convierte en un producto desplegable: no habrá multitenancy, JWT, registro público, PostgreSQL ni despliegue automático.

## Alcance

- Toda ruta bajo `/api/users/**` exige autenticación.
- Un usuario demo solo puede leer o escribir sus propias rutas, telemetría y emergencias. Un administrador puede operar sobre cualquier usuario.
- La identidad de `/api/auth/me` procede del usuario persistido, no de IDs codificados.
- Las coordenadas y la velocidad se validan antes de guardar.
- CORS permite solo orígenes locales usados por React y Capacitor; se desactiva la consola H2.
- La interfaz deja de registrar credenciales, consume la ruta activa real y muestra éxito de emergencia solo tras respuesta correcta.
- La vista de usuarios solo conserva acciones que la API actual soporta: listado y consulta de rutas.
- CI ejecuta el build del frontend, las pruebas Maven y análisis CodeQL en GitHub Actions.

## Diseño técnico

El backend conserva HTTP Basic y las dos cuentas demo. Los usuarios sembrados usan `admin@pesv.co` y `user@pesv.co`, que corresponden a los nombres `admin` y `user` usados por Spring Security. `RouteService` resuelve al usuario autenticado y decide si puede acceder al ID recibido.

Los controladores reciben cuerpos tipados para ruta, telemetría y emergencia. Rechazan valores ausentes, no finitos o fuera de rango con HTTP 400. Las rutas y emergencias siguen siendo datos H2 en memoria, por diseño de demostración.

El frontend no inventa una ruta. Consulta la ruta activa y conserva el mapa vacío cuando no existe. La gestión de usuarios se ajusta al modelo real que devuelve el backend, sin crear ni editar cuentas inexistentes.

## Pruebas

Las pruebas Spring Boot cubren:

1. Un visitante sin credenciales no puede crear telemetría.
2. Un usuario no puede escribir para otro ID.
3. `/api/auth/me` devuelve el ID persistido correcto.
4. Coordenadas inválidas devuelven 400.
5. Un administrador puede consultar las rutas de otro usuario.

El flujo de CI falla si el frontend no compila, las pruebas backend fallan o CodeQL detecta un problema bloqueante.

## Riesgos aceptados

Las cuentas y HTTP Basic continúan en código porque la aplicación es una demo local. H2 borra los datos al reiniciar. Los proveedores de rutas externos no se usarán como evidencia de una ruta real sin una clave configurada.
