import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/user/user.entity.js';
import { Vehicle } from '../../modules/vehicle/vehicle.entity.js';
import { Mechanic } from '../../modules/mechanic/mechanic.entity.js';
import { Workshop } from '../../modules/workshop/workshop.entity.js';
import { Maintenance } from '../../modules/maintenance/maintenance.entity.js';
import { UserRoles } from '../../common/enums/domain.enums.js';
import { VehicleStates } from '../../common/enums/domain.enums.js';
import { MaintenanceStates, MaintenanceTypes } from '../../common/enums/domain.enums.js';

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

export async function runSeed() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

  // Si la BD ya tiene usuarios, se considera que el seed ya se ejecutó.
  if ((await userRepo.count()) > 0) {
    await AppDataSource.destroy();
    throw new Error('Seed already executed');
  }

  const hash = await bcrypt.hash('Password123!', 10);
  await userRepo.save([
    userRepo.create({ email: 'admin@fleetcore.com', passwordHash: hash, roles: [UserRoles.ADMIN] }),
    userRepo.create({ email: 'tech1@fleetcore.com', passwordHash: hash, roles: [UserRoles.TECHNICIAN] }),
    userRepo.create({ email: 'tech2@fleetcore.com', passwordHash: hash, roles: [UserRoles.TECHNICIAN] }),
  ]);

  const mechanicRepo = AppDataSource.getRepository(Mechanic);
  if ((await mechanicRepo.count()) === 0) {
    await mechanicRepo.save([
      mechanicRepo.create({ name: 'Mecanico 1', email: 'm1@fleetcore.com', specialty: 'Motor', active: true }),
      mechanicRepo.create({ name: 'Mecanico 2', email: 'm2@fleetcore.com', specialty: 'Frenos', active: true }),
      mechanicRepo.create({ name: 'Mecanico 3', email: 'm3@fleetcore.com', specialty: 'General', active: false }),
    ]);
  }

  const workshopRepo = AppDataSource.getRepository(Workshop);
  if ((await workshopRepo.count()) === 0) {
    await workshopRepo.save([
      workshopRepo.create({ name: 'Taller Central', address: 'Calle 1', active: true }),
      workshopRepo.create({ name: 'Taller Secundario', address: 'Calle 2', active: false }),
    ]);
  }

  const vehicleRepo = AppDataSource.getRepository(Vehicle);
  if ((await vehicleRepo.count()) === 0) {
    await vehicleRepo.save([
      vehicleRepo.create({ plate: 'ABC123', brand: 'Toyota', model: 'Hilux', year: 2020, mileage: 10000, state: VehicleStates.AVAILABLE }),
      vehicleRepo.create({ plate: 'DEF456', brand: 'Ford', model: 'Ranger', year: 2021, mileage: 15000, state: VehicleStates.AVAILABLE }),
      vehicleRepo.create({ plate: 'GHI789', brand: 'Chevrolet', model: 'D-Max', year: 2019, mileage: 20000, state: VehicleStates.IN_MAINTENANCE }),
      vehicleRepo.create({ plate: 'JKL012', brand: 'Nissan', model: 'Frontier', year: 2018, mileage: 25000, state: VehicleStates.INACTIVE }),
    ]);
  }

  const maintenanceRepo = AppDataSource.getRepository(Maintenance);
  if ((await maintenanceRepo.count()) === 0) {
    const vehicles = await vehicleRepo.find();
    const mechanics = await mechanicRepo.find();
    const workshops = await workshopRepo.find();
    await maintenanceRepo.save([
      maintenanceRepo.create({ type: MaintenanceTypes.PREVENTIVE, description: 'Mant. inicial', mileage: 20000, scheduledDate: new Date(), state: MaintenanceStates.IN_PROGRESS, vehicleId: vehicles[2].id, mechanicId: mechanics[0].id, workshopId: workshops[0].id }),
      maintenanceRepo.create({ type: MaintenanceTypes.CORRECTIVE, description: 'Mant. completado', mileage: 10000, scheduledDate: new Date(), state: MaintenanceStates.COMPLETED, vehicleId: vehicles[0].id, mechanicId: mechanics[1].id, workshopId: workshops[0].id, workPerformed: 'Cambio de aceite', finalCost: 100, completionDate: new Date(), finalMileage: 10050 }),
    ]);
  }

  await AppDataSource.destroy();
  console.log('Seed done');
}

if (import.meta.url === `file://${process.argv[1]}`) { runSeed().catch((e)=>{console.error(e);process.exit(1);}); }
