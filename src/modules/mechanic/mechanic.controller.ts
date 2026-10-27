import { Controller, Get, Post, Put, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Mechanic } from './mechanic.entity.js';
import { MechanicService } from './mechanic.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRoles } from '../../common/enums/domain.enums.js';

export class CreateMechanicDto {
  name: string;
  email: string;
  specialty: string;
}

@Controller('mechanics')
@UseGuards(JwtGuard, RolesGuard)
export class MechanicController {
  constructor(private readonly service: MechanicService) {}

  @Get()
  async findAll(): Promise<Mechanic[]> { return this.service.findAll(); }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Mechanic> {
    const m = await this.service.findById(id);
    if (!m) throw new HttpException('Mechanic not found', HttpStatus.NOT_FOUND);
    return m;
  }

  @Post()
  @Roles(UserRoles.ADMIN)
  async create(@Body() dto: CreateMechanicDto): Promise<Mechanic> {
    return this.service.create({ name: dto.name, email: dto.email, specialty: dto.specialty, active: true });
  }

  @Put(':id')
  @Roles(UserRoles.ADMIN)
  async update(@Param('id') id: string, @Body() dto: Partial<Mechanic>): Promise<Mechanic> {
    return this.service.update(id, dto);
  }
}
