import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserRoles, UserResponse } from './user.entity.js';
import type { User } from './user.entity.js';
import { UserService } from './user.service.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

/** Body de Crear usuario (solo admin). */
export class CreateUserDto {
  email: string;
  password: string;
  roles?: UserRoles[];
}

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** Lista todos los usuarios (solo ADMIN). */
  @Get()
  @Roles(UserRoles.ADMIN)
  async findAll(): Promise<UserResponse[]> {
    const users = await this.userService.findAll();
    return users.map((u) => new UserResponse(u));
  }

  /** Devuelve un usuario por id (ADMIN o el propio usuario). */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    // Un usuario común solo puede ver su propio perfil.
    if (currentUser.id !== id && !currentUser.roles.includes(UserRoles.ADMIN)) {
      throw new HttpException('No autorizado', HttpStatus.FORBIDDEN);
    }
    return user;
  }

  /** Crea un usuario (solo ADMIN). */
  @Post()
  @Roles(UserRoles.ADMIN)
  async create(@Body() dto: CreateUserDto): Promise<UserResponse> {
    return this.userService.create(
      dto.email,
      dto.password,
      dto.roles ?? [UserRoles.TECHNICIAN],
    );
  }
}