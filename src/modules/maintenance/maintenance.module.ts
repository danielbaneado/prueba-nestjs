import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintenance } from './maintenance.entity.js';
import { MaintenanceDao } from './dao/maintenance.dao.js';

@Module({
  imports: [TypeOrmModule.forFeature([Maintenance])],
  providers: [MaintenanceDao],
  exports: [MaintenanceDao],
})
export class MaintenanceModule {}
