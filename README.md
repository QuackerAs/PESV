# PESV Frontend

Sistema de Gestión de Seguridad Vial - Frontend

## Descripción

Aplicación web para la gestión integral de Seguridad Vial, permitiendo administración de usuarios, vehículos, capacitaciones, indicadores y más. Diseño profesional corporativo con navegación intuitiva.

## Inicio Rápido

### Requisitos Previos
- Node.js (v14 o superior)
- npm

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd pesv-frontend

# Instalar dependencias
npm install
```

### Ejecutar en Desarrollo

```bash
npm start
```

La aplicación estará disponible en: **http://localhost:3001**

### Build para Producción

```bash
npm run build
```

## Credenciales de Prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@pesv.com` | `admin123` | Administrador |
| `user@pesv.com` | `user123` | Usuario |
| `coordinador@pesv.com` | `coord123` | Coordinador |

## Características

- Autenticación segura (Mock auth)
- Dashboard administrador con estadísticas
- Gestión de usuarios
- Navegación sidebar fija y responsiva
- Diseño profesional corporativo
- Sistema de roles y permisos
- Interfaz intuitiva

## Tecnologías

- **React** 18.2.0 - Librería UI
- **React Router** 6.20.0 - Enrutamiento
- **Lucide React** - Iconos
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos
- **React Scripts** - Herramientas de compilación

## Estructura del Proyecto

```
src/
├── context/          # Estado global (autenticación)
├── hooks/            # Hooks personalizados
├── services/         # Llamadas a API
├── components/       # Componentes reutilizables
│   ├── common/       # Botones, inputs
│   └── layout/       # Sidebar, Layout
├── pages/            # Páginas de la aplicación
├── styles/           # Estilos globales
└── App.js           # Configuración de rutas
```

## Documentación

- [Guía de Desarrollo](./DEVELOPMENT_GUIDE.md) - Detalles técnicos y patrones
- [Resumen de Cleanup](./CODE_CLEANUP_SUMMARY.md) - Cambios de refactorización
- [Mejoras de Arquitectura](./ARCHITECTURE_IMPROVEMENTS.md) - Principios SOLID

## Paleta de Colores

- **Primario:** Azul `#2563EB`
- **Secundario:** Gris-Azul `#64748B`
- **Éxito:** Verde `#059669`
- **Peligro:** Rojo `#DC2626`

## Scripts Disponibles

```bash
npm start              # Ejecutar en desarrollo
npm run build          # Compilar para producción
npm test              # Ejecutar pruebas
npm run eject         # Ejectar configuración (irreversible)
```

## Configuración

La aplicación usa un sistema de autenticación mock. Para cambiar a backend real, modificar en `src/services/api.js`:

```javascript
const USE_MOCK = false;  // Cambiar de true a false
```

## Licencia

Todos los derechos reservados © 2026

---

**Estado:** Listo para producción | **Última actualización:** Enero 2026
