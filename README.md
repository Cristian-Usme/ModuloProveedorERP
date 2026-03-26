# Gestión de Proveedores - ERP

Este proyecto es un sistema de gestión de proveedores que incluye una aplicación web (frontend) y un servicio backend desarrollado con Spring Boot.

## Estructura del Proyecto

- **backend/**: API basada en Spring Boot para la lógica de negocio y gestión de datos.
- **frontend/**: Interfaz de usuario desarrollada con React y Vite.
- **docker-compose.yml**: Configuración para levantar la base de datos PostgreSQL y el backend de forma rápida.

## Requisitos Previos

- Docker y Docker Compose (recomendado)
- Node.js (opcional, para desarrollo frontend local)
- Java 17 (opcional, para desarrollo backend local)

## Cómo empezar

### Backend y Base de Datos

Para levantar el backend y la base de datos automáticamente, ejecuta:

```bash
docker-compose up -d
```

El backend estará disponible en `http://localhost:8080` y el Swagger en `http://localhost:8080/swagger-ui.html`.

### Frontend

Si prefieres correr el frontend de forma local para desarrollo:

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

## Usuarios de Prueba

- **Administrador**: `admin@upb.edu.co` / `Admin2026!`
- **Comprador**: `comprador@upb.edu.co` / `Test1234!`
- **Consulta**: `consulta@upb.edu.co` / `Test1234!`
