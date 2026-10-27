import { Global, Module } from '@nestjs/common';
import { Bcrypt } from './bcrypt.js';
import { Jwt } from './jwt.js';
import { AppLogger } from './logger.js';
import { Password } from './password.js';
import { TokenExpiry } from './token-expiry.js';

/**
 * Módulo global de utilitarios compartidos.
 *
 * Se provee como `@Global()` para que `ConfigService`, `Bcrypt`, `Jwt`,
 * `Captcha`, `AppLogger`, `Password` y `TokenExpiry` estén disponibles
 * en cualquier módulo de dominio sin tener que importarlos explícitamente.
 */
@Global()
@Module({
  providers: [Bcrypt, Jwt, AppLogger, Password, TokenExpiry],
  exports: [Bcrypt, Jwt, AppLogger, Password, TokenExpiry],
})
export class UtilsModule {}