import { Controller, Get, Post, Put, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Vehicle } from './vehicle.entity.js';
import { VehicleService } from './vehicle.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { ApiKeyGuard } from '../../common/guards/api-key.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { UserRoles, VehicleStates } from '../../common/enums/domain.enums.js';

export class CreateVehicleDto {
  plate: string;
  brand: string;
  model: string;
  year: number;
  mileage?: number;
}

@Controller('vehicles')
@UseGuards(JwtGuard, RolesGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  async findAll(): Promise<Vehicle[]> {
    return this.vehicleService.findAll();
  }

  @Get('available-count')
  @Public()
  @UseGuards(ApiKeyGuard)
  async availableCount(): Promise<{ count: number }> {
    const vehicles = await this.vehicleService.findAll();
    const count = vehicles.filter((v) => v.state === VehicleStates.AVAILABLE).length;
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vehicle> {
    const v = await this.vehicleService.findById(id);
    if (!v) throw new HttpException('Vehicle not found', HttpStatus.NOT_FOUND);
    return v;
  }

  @Post()
  @Roles(UserRoles.ADMIN)
  async create(@Body() dto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehicleService.create({
      plate: dto.plate,
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      mileage: dto.mileage ?? 0,
      state: VehicleStates.AVAILABLE,
    } as any);
  }

  @Put(':id')
  @Roles(UserRoles.ADMIN)
  async update(@Param('id') id: string, @Body() dto: Partial<Vehicle>): Promise<Vehicle> {
    return this.vehicleService.update(id, dto);
  }
}
