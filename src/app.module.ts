import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigService } from './config/config.service.js';
import { UtilsModule } from './common/utils/utils.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';

/**
 * Módulo raíz.
 *
 * - `ConfigService` y los utilitarios de `UtilsModule` se proveen como
 *   singletons globales: cualquier controlador/service del proyecto puede
 *   inyectarlos sin importarlos explícitamente en cada módulo de dominio.
 * - `AuthModule` y `UsersModule` son los módulos de dominio principales.
 */
@Global()
@Module({
  imports: [UtilsModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  exports: [ConfigService],
})
export class AppModule {}