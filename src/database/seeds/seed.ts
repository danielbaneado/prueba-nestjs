import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../modules/user/user.entity.js';
import { Vehicle } from '../../modules/vehicle/vehicle.entity.js';
import { Mechanic } from '../../modules/mechanic/mechanic.entity.js';
import { Workshop } from '../../modules/workshop/workshop.entity.js';
import { Maintenance } from '../../modules/maintenance/maintenance.entity.js';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'postgres',
  database: process.env.POSTGRES_DB ?? 'fleetcore',
  entities: [User, Vehicle, Mechanic, Workshop, Maintenance],
  synchronize: true,
});

async function run() {
  await AppDataSource.initialize();
  // Seed minimal data
  const userRepo = AppDataSource.getRepository(User);
  if ((await userRepo.count()) === 0) {
    await userRepo.save(userRepo.create({ email: 'admin@fleetcore.com', passwordHash: 'hashed', roles: ['admin'] as any }));
  }
  await AppDataSource.destroy();
  console.log('Seed done');
}

run().catch((e) => { console.error(e); process.exit(1); });
