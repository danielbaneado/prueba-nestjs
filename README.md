# FleetCore - API de mantenimiento de flota

API REST con NestJS, TypeScript, JWT, TypeORM y PostgreSQL para administrar vehículos, mecánicos, talleres y mantenimientos de la flota.

## Descripción de módulos

- `auth`: registro/login, JWT, guards, decoradores (@Roles, @CurrentUser, @Public), API key.
- `user`: usuarios y roles ADMIN/TECHNICIAN.
- `vehicle`: CRUD de vehículos, estados AVAILABLE/IN_MAINTENANCE/INACTIVE.
- `mechanic`: CRUD de mecánicos, activación/inactivación.
- `workshop`: CRUD de talleres, activación/inactivación.
- `maintenance`: creación, cambio de estado, historial, reglas de negocio.
- `seed`: endpoint protegido por SEED_API_KEY.
- `common`: guards, filtros, interceptores, enums, utilidades.
- `config`: configuración y variables de entorno.
- `database`: migraciones y seeds.

## Inicialización paso a paso

1. Copiar `.env.example` a `.env` y ajustar variables (DB, JWT, API_KEY, SEED_API_KEY).
2. Instalar dependencias: `npm install`
3. Levantar PostgreSQL (docker compose up -d).
4. Ejecutar migraciones: `npm run migration:run`
5. Ejecutar seed: `npm run seed` o `POST /seed` con header `x-seed-api-key`.
6. Iniciar servidor: `npm run start:dev`

## Swagger

Documentación disponible en: http://localhost:5001/api/docs
