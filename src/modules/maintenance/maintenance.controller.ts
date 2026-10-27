import { Controller, Get, Post, Put, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Maintenance } from './maintenance.entity.js';
import { MaintenanceService } from './maintenance.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRoles } from '../../common/enums/domain.enums.js';

export class CreateMaintenanceDto {
  type: any;
  description: string;
  mileage: number;
  scheduledDate: string;
  vehicleId: string;
  mechanicId: string;
  workshopId: string;
}

@Controller('maintenances')
@UseGuards(JwtGuard, RolesGuard)
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}

  @Get()
  async findAll(): Promise<Maintenance[]> { return this.service.findAll(); }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Maintenance> {
    const m = await this.service.findById(id);
    if (!m) throw new HttpException('Maintenance not found', HttpStatus.NOT_FOUND);
    return m;
  }

  @Post()
  @Roles(UserRoles.ADMIN)
  async create(@Body() dto: CreateMaintenanceDto): Promise<Maintenance> {
    return this.service.create({
      type: dto.type,
      description: dto.description,
      mileage: dto.mileage,
      scheduledDate: new Date(dto.scheduledDate),
      vehicleId: dto.vehicleId,
      mechanicId: dto.mechanicId,
      workshopId: dto.workshopId,
    } as any);
  }

  @Put(':id/state')
  async updateState(@Param('id') id: string, @Body() body: { state: any }): Promise<Maintenance> {
    return this.service.updateState(id, body.state);
  }
}
