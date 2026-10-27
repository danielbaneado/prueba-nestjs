import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mechanic } from './mechanic.entity.js';
import { MechanicDao } from './dao/mechanic.dao.js';
import { MechanicService } from './mechanic.service.js';
import { MechanicController } from './mechanic.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mechanic])],
  providers: [MechanicDao, MechanicService],
  controllers: [MechanicController],
  exports: [MechanicService, MechanicDao],
})
export class MechanicModule {}
