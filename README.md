# prueba-nestjs

Plantilla NestJS (TypeScript, ESM) para backends con autenticación por cookie JWT, gestión de usuarios, rate limiting, CORS, Helmet, Swagger y validación de DTOs.

## Requisitos
- Node.js >= 20
- npm

## Setup
```bash
cp .env.example .env
npm install
```

## Persistencia
La plantilla usa un store en memoria (`UserStore`). Los datos se pierden al reiniciar. Para producción, migrar a PostgreSQL/TypeORM (variables `DB_*`/`POSTGRES_*` reservadas en `.env.example`).

## Ejecutar
```bash
npm run start:dev   # desarrollo con watch
npm run build && npm run start:prod
```

## Tests
```bash
npm run test        # unitarios
npm run test:e2e    # e2e
npm run test:cov    # cobertura
npm run lint
```

## Licencia
UNLICENSED
