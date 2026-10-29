# FleetCore - Fleet Maintenance API

REST API built with NestJS, TypeScript, JWT, TypeORM and PostgreSQL to manage vehicles, mechanics, workshops and maintenance records.

## Module overview

- `auth`: authentication/authorization (login, refresh, logout, guards, decorators, API key).
- `user`: users and roles (ADMIN/TECHNICIAN).
- `vehicle`: vehicle CRUD and states (AVAILABLE/IN_MAINTENANCE/INACTIVE).
- `mechanic`: mechanic CRUD and activation.
- `workshop`: workshop CRUD and activation.
- `maintenance`: maintenance creation, state transitions, history and business rules.
- `seed`: seed endpoint protected by SEED_API_KEY.
- `common`: guards, filters, interceptors, enums, utilities.
- `config`: configuration and environment variables.
- `database`: migrations and seeds.

## Initialization

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install`
3. Start database: `docker compose up -d db`
4. Run migrations: `npm run migration:run`
5. Run seed: `npm run seed` or `POST /seed` with `x-seed-api-key`.
6. Start server: `npm run start:dev`

## Swagger

Documentation: http://localhost:3000/api/docs

## Seed data

- 1 ADMIN and 2 TECHNICIAN users
- 3 mechanics (2 active, 1 inactive)
- 2 workshops (1 active, 1 inactive)
- 4 vehicles (2 available, 1 in maintenance, 1 inactive)
- 1 completed maintenance for history

## Notes

- JWT via cookie `session_token` or Bearer header.
- x-api-key for external integration endpoint.
- x-seed-api-key for seed endpoint.

## Example payloads

### Vehicle (PUT)
```json
{
  "plate": "ABC123",
  "brand": "Toyota",
  "model": "Hilux",
  "year": 2021,
  "mileage": 12000,
  "state": "available"
}
```

### Mechanic (PUT)
```json
{
  "name": "Mecanico 1",
  "email": "m1@fleetcore.com",
  "specialty": "Motor",
  "active": true
}
```

### Workshop (PUT)
```json
{
  "name": "Taller Central",
  "address": "Calle 1",
  "active": true
}
```

### Maintenance (PUT state)
```json
{
  "state": "completed",
  "workPerformed": "Cambio de aceite",
  "finalCost": 100,
  "completionDate": "2026-10-27T10:00:00.000Z",
  "finalMileage": 10050
}
```
