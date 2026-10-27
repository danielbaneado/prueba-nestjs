import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintenance } from './maintenance.entity.js';
import { MaintenanceDao } from './dao/maintenance.dao.js';
import { MaintenanceService } from './maintenance.service.js';
import { MaintenanceController } from './maintenance.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Maintenance])],
  providers: [MaintenanceDao, MaintenanceService],
  controllers: [MaintenanceController],
  exports: [MaintenanceService, MaintenanceDao],
})
export class MaintenanceModule {}
