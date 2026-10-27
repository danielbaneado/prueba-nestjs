import { Module } from '@nestjs/common';
import { VehicleDao } from './dao/vehicle.dao.js';
import { VehicleService } from './vehicle.service.js';
import { VehicleController } from './vehicle.controller.js';

@Module({
  providers: [VehicleDao, VehicleService],
  controllers: [VehicleController],
  exports: [VehicleService, VehicleDao],
})
export class VehicleModule {}
