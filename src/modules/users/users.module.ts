import { Module } from '@nestjs/common';
import { UserStore } from './user.store.js';
import { UsersService } from './users.service.js';
import { UserController } from './users.controller.js';

/**
 * Módulo de gestión de usuarios.
 *
 * Provee:
 * - `UserStore`: capa de persistencia (placeholder para TypeORM).
 * - `UsersService`: lógica de negocio (hash, validación, bloqueo).
 * - `UserController`: endpoints REST (solo ADMIN, salvo propio perfil).
 */
@Module({
  providers: [UserStore, UsersService],
  controllers: [UserController],
  exports: [UsersService, UserStore],
})
export class UsersModule {}