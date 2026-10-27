# Implementation Tracker - FleetCore Maintenance API

Tracking of features to implement per REQUIREMENTS.md. Update statuses as work progresses (pending / in_progress / done).

## Conventions (from REQUIREMENTS.md)
- Names/code in English, files kebab-case.
- Imports with `.js` extension (ESM).
- DB columns snake_case.
- HTTP routes plural, English.
- Branches: `feature/HU-XX-short-description`.
- Architecture: controller -> service -> dao (typeorm).
- No over-engineering: no generic base classes, no CQRS, no extra libs.
- Tests: minimum 40% coverage.

## Modules to implement

### 1. Auth (exists)
- [ ] Register users with roles ADMIN/TECHNICIAN
- [ ] Login with email/password (argon2)
- [ ] JWT generation
- [ ] Guards: JwtGuard, RolesGuard
- [ ] Decorators: @Roles(), @CurrentUser(), @Public()
- [ ] x-api-key Guard for external integration endpoint
- [ ] @Public() on integration endpoint (api key)

### 2. Users (exists)
- [ ] User entity/dao/service/controller

### 3. Vehicles (exists)
- [ ] Entity (placa, marca, modelo, año, kilometraje, estado) with unique placa
- [ ] DAO
- [ ] Service (CRUD, soft delete/inactivate)
- [ ] Controller (list, create, get by id/placa, update, inactivate)
- [ ] States: AVAILABLE, IN_MAINTENANCE, INACTIVE
- [ ] Inactive cannot be assigned to maintenance
- [ ] Migration

### 4. Mechanics (exists)
- [ ] Entity (nombre, correo, especialidad, estado)
- [ ] DAO
- [ ] Service (CRUD, activate/inactivate)
- [ ] Controller
- [ ] Inactive cannot be assigned
- [ ] Schedule overlap validation (active maintenances)
- [ ] Migration

### 5. Workshops (exists)
- [ ] Entity (nombre, dirección, estado)
- [ ] DAO
- [ ] Service
- [ ] Controller (list active, get, activate/inactivate)
- [ ] Inactive cannot be assigned
- [ ] Migration
- [ ] Secure endpoint must be exposed that allows active workshops to be listed

### 6. Maintenances (exists)
- [ ] A protected endpoint must be exposed to allow the creation of maintenance tasks
- [ ] Entity (type, description, mileage, scheduledDate, state, vehicle, mechanic, workshop, workPerformed, finalCost, completionDate, finalMileage)
- [ ] Types: PREVENTIVE, CORRECTIVE
- [ ] States: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
- [ ] DAO
- [ ] Service (create, update status, queries)
- [ ] Controller (create, update status, list all, active, by vehicle, by mechanic, history)
- [ ] Business rules (vehicle active, mechanic active, workshop active, one active maintenance per vehicle/mechanic, mileage >= vehicle mileage, state transitions, required closing info)
- [ ] Vehicle state updates on IN_PROGRESS/COMPLETED
- [ ] Migration

### 7. Common (interceptor, exception filter) (exists)
- [ ] Response interceptor (uniform success format)
- [ ] Exception filter (http code, message, path, date)
- [ ] Validation/auth errors not 500
- [ ] DB uniqueness conflicts handled

### 8. Database & Seeders
- [ ] TypeORM config (PostgreSQL)
- [ ] Migrations generated & run
- [ ] Seeder command (npm run seed) idempotent
- [ ] Seed data: 1 ADMIN + 2 TECHNICIAN users; 3 mechanics; 2 workshops; 4 vehicles; >=1 completed maintenance

### 9. Tests
- [ ] Unit tests (>=2 on key state transitions)
- [ ] Coverage >= 40%

### 10. Env
- [ ] .env.example with keys (DB, JWT, API_KEY)

## Notes / Risks
- Concurrency: two requests assigning same mechanic -> transaction + locking.
- State transitions transactional (maintenance + vehicle).
- Seeder idempotency via upserts/checks.
