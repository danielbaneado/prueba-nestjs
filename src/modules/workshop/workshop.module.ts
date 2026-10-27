import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from './workshop.entity.js';
import { WorkshopDao } from './dao/workshop.dao.js';
import { WorkshopService } from './workshop.service.js';
import { WorkshopController } from './workshop.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Workshop])],
  providers: [WorkshopDao, WorkshopService],
  controllers: [WorkshopController],
  exports: [WorkshopService, WorkshopDao],
})
export class WorkshopModule {}
