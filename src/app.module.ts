import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigService } from './config/config.service.js';
import { UtilsModule } from './common/utils/utils.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UserModule } from './modules/user/user.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity.js';
import { Vehicle } from './modules/vehicle/vehicle.entity.js';
import { Mechanic } from './modules/mechanic/mechanic.entity.js';
import { Maintenance } from './modules/maintenance/maintenance.entity.js';
import { VehicleModule } from './modules/vehicle/vehicle.module.js';
import { MechanicModule } from './modules/mechanic/mechanic.module.js';
import { WorkshopModule } from './modules/workshop/workshop.module.js';
import { Workshop } from './modules/workshop/workshop.entity.js';
import { MaintenanceModule } from './modules/maintenance/maintenance.module.js';
/**
 * Módulo raíz.
 *
 * - `ConfigService` y los utilitarios de `UtilsModule` se proveen como
 *   singletons globales: cualquier controlador/service del proyecto puede
 *   inyectarlos sin importarlos explícitamente en cada módulo de dominio.
 * - `AuthModule` y `UsersModule` son los módulos de dominio principales.
 */
@Global()
@Module({
  imports: [TypeOrmModule.forRoot({ 
    type: 'postgres', 
    host: process.env.POSTGRES_HOST ?? 'localhost', 
    port: Number(process.env.POSTGRES_PORT ?? 5432), 
    username: process.env.POSTGRES_USER ?? 'postgres', 
    password: process.env.POSTGRES_PASSWORD ?? 'postgres', 
    database: process.env.POSTGRES_DB ?? 'fleetcore', 
    entities: [User, Vehicle, Mechanic, Workshop, Maintenance], 
    synchronize: true }), 
    UtilsModule, AuthModule, UserModule, VehicleModule, MechanicModule, WorkshopModule, MaintenanceModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  exports: [ConfigService],
})
export class AppModule {}