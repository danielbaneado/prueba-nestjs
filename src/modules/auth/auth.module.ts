import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';

/**
 * Módulo de autenticación.
 *
 * Expone los endpoints de login, refresh, logout, me y admin.
 * Usa `UsersService` (inyectado desde UsersModule) para buscar/ crear usuarios.
 * El `JwtGuard` es un guard custom (no usa Passport).
 */
@Module({
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}