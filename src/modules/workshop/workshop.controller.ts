import { Controller, Get, Post, Put, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Workshop } from './workshop.entity.js';
import { WorkshopService } from './workshop.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRoles } from '../../common/enums/domain.enums.js';

export class CreateWorkshopDto {
  name: string;
  address: string;
}

@Controller('workshops')
@UseGuards(JwtGuard, RolesGuard)
export class WorkshopController {
  constructor(private readonly service: WorkshopService) {}

  @Get()
  async findAll(): Promise<Workshop[]> { 
    return this.service.findAll(); 
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Workshop> {
    const w = await this.service.findById(id);
    if (!w) throw new HttpException('Workshop not found', HttpStatus.NOT_FOUND);
    return w;
  }

  @Post()
  @Roles(UserRoles.ADMIN)
  async create(@Body() dto: CreateWorkshopDto): Promise<Workshop> {
    return this.service.create({ name: dto.name, address: dto.address, active: true });
  }

  @Put(':id')
  @Roles(UserRoles.ADMIN)
  async update(@Param('id') id: string, @Body() dto: Partial<Workshop>): Promise<Workshop> {
    return this.service.update(id, dto);
  }
}
