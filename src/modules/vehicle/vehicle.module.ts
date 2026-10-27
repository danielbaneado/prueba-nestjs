import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity.js';
import { VehicleDao } from './dao/vehicle.dao.js';
import { VehicleService } from './vehicle.service.js';
import { VehicleController } from './vehicle.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [VehicleDao, VehicleService],
  controllers: [VehicleController],
  exports: [VehicleService, VehicleDao],
})
export class VehicleModule {}
