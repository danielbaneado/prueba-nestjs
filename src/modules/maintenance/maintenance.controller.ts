import { Controller, Get, Post, Put, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Maintenance } from './maintenance.entity.js';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRoles, MaintenanceStates, MaintenanceTypes } from '../../common/enums/domain.enums.js';
import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMaintenanceDto {
  @ApiProperty({ example: 'PREVENTIVE', enum: MaintenanceTypes })
  @IsEnum(MaintenanceTypes)
  type: MaintenanceTypes;
  @ApiProperty({ example: 'Mant. inicial' })
  description: string;
  @ApiProperty({ example: 20000 })
  mileage: number;
  @ApiProperty({ example: '2026-10-27T10:00:00.000Z' })
  scheduledDate: string;
  @ApiProperty({ example: 'vehicle-id' })
  vehicleId: string;
  @ApiProperty({ example: 'mechanic-id' })
  mechanicId: string;
  @ApiProperty({ example: 'workshop-id' })
  workshopId: string;
}

export class UpdateMaintenanceStateDto {
  @ApiProperty({ example: 'completed', enum: MaintenanceStates })
  @IsEnum(MaintenanceStates)
  state: MaintenanceStates;

  @ApiProperty({ example: 'Cambio de aceite', required: false })
  @IsOptional()
  @IsString()
  workPerformed?: string;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsNumber()
  finalCost?: number;

  @ApiProperty({ example: '2026-10-27T10:00:00.000Z', required: false })
  @IsOptional()
  @IsString()
  completionDate?: string;

  @ApiProperty({ example: 10050, required: false })
  @IsOptional()
  @IsNumber()
  finalMileage?: number;
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
    });
  }

  @Put(':id/state')
  async updateState(
    @Param('id') id: string,
    @Body() dto: UpdateMaintenanceStateDto,
  ): Promise<Maintenance> {
    const { state, ...closing } = dto;
    return this.service.updateState(id, state, closing);
  }
}
