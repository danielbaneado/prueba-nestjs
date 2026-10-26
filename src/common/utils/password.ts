import { Injectable } from '@nestjs/common';
import { Config, ConfigService } from '../../config/config.service.js';

/**
 * Validación de fortaleza de contraseña.
 *
 * Las reglas se configuran por variables de entorno:
 * - PASSWORD_MIN_LENGTH (default 10)
 * - PASSWORD_REQUIRE_DIGIT (default true)
 * - PASSWORD_REQUIRE_LOWER (default true)
 * - PASSWORD_REQUIRE_UPPER (default true)
 * - PASSWORD_REQUIRE_SPECIAL (default true)
 */
@Injectable()
export class Password {
  private readonly minLength: number;
  private readonly requireDigit: boolean;
  private readonly requireLower: boolean;
  private readonly requireUpper: boolean;
  private readonly requireSpecial: boolean;

  constructor(configService: ConfigService) {
    this.minLength = configService.getNumber(Config.PASSWORD_MIN_LENGTH) ?? 10;
    this.requireDigit = configService.getBoolean(Config.PASSWORD_REQUIRE_DIGIT);
    this.requireLower = configService.getBoolean(Config.PASSWORD_REQUIRE_LOWER);
    this.requireUpper = configService.getBoolean(Config.PASSWORD_REQUIRE_UPPER);
    this.requireSpecial = configService.getBoolean(Config.PASSWORD_REQUIRE_SPECIAL);
  }

  /**
   * Devuelve `true` si la contraseña cumple todas las reglas configuradas.
   * Si la contraseña no es string, devuelve `false`.
   */
  validatePassword(password: unknown): boolean {
    if (typeof password !== 'string') return false;

    const hasMinLength = password.length >= this.minLength;
    const hasDigit = /[0-9]/.test(password);
    const hasLowercase = /\p{Ll}/u.test(password);
    const hasUppercase = /\p{Lu}/u.test(password);
    const hasSpecialChar = /[\p{P}\p{S}]/u.test(password);

    return (
      hasMinLength &&
      (!this.requireDigit || hasDigit) &&
      (!this.requireLower || hasLowercase) &&
      (!this.requireUpper || hasUppercase) &&
      (!this.requireSpecial || hasSpecialChar)
    );
  }
}