import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Config, ConfigService } from '../../config/config.service.js';
import { Jwt } from '../../common/utils/jwt.js';
import { Bcrypt } from '../../common/utils/bcrypt.js';
import { Captcha } from '../../common/utils/captcha.js';
import { UsersService } from '../user/user.service.js';
import { User, UserResponse } from '../user/user.entity.js';
import { createCookieOptions } from '../../config/cookie.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  user: UserResponse;
  tokens: AuthTokens;
}

/**
 * Servicio de autenticación.
 *
 * Flujo de login:
 * 1. Valida el captcha (uso único).
 * 2. Busca el usuario por email; si no existe, lanza 401 (no revelamos si el email existe).
 * 3. Verifica que el usuario no esté bloqueado.
 * 4. Compara la contraseña con Bcrypt.
 * 5. Si falla, registra el intento y bloquea si supera el límite.
 * 6. Si tiene éxito, genera access + refresh token (JWT con jti único).
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: Jwt,
    private readonly bcrypt: Bcrypt,
    private readonly captcha: Captcha,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Valida un captcha y autentica al usuario.
   * Devuelve el usuario (sin hash) y los tokens de acceso/refresh.
   */
  async login(email: string, rawPassword: string, captchaToken: string, captchaAnswer: number): Promise<LoginResult> {
    // 1. Validar captcha (uso único).
    if (!this.captcha.verifyCaptcha(captchaToken, captchaAnswer)) {
      throw new BadRequestException('Captcha inválido o expirado');
    }

    // 2. Buscar usuario.
    const user = await this.usersService.findByEmail(email);
    // No revelamos si el email existe: mismo error genérico.
    if (!user) {
      await this.failLogin(email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Verificar bloqueo.
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Cuenta bloqueada. Inténtalo más tarde');
    }

    // 4. Comparar contraseña.
    const passwordOk = await this.bcrypt.comparePassword(rawPassword, user.passwordHash);
    if (!passwordOk) {
      await this.usersService.recordFailedAttempt(user.id);
      await this.failLogin(email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 5. Éxito: limpiar intentos.
    await this.usersService.resetFailures(user.id);

    // 6. Generar tokens.
    const tokens = this.generateTokens(user);

    return { user: new UserResponse(user), tokens };
  }

  /** Refresca el access token usando un refresh token válido. */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = await this.jwt.verifyToken(refreshToken, this.getRefreshSecret());
    if (!payload) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const user = await this.usersService.findById(payload.sub as string);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const fullUser: User = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      passwordHash: '',
      failedAttempts: 0,
      lockedUntil: null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return this.generateTokens(fullUser);
  }

  /** Devuelve las opciones de cookie para el response (access token). */
  getCookieOptions() {
    return createCookieOptions(this.configService);
  }

  // ---- Helpers privados ----

  private generateTokens(user: User): AuthTokens {
    const accessExpiry = this.configService.get(Config.JWT_ACCESS_EXPIRES_IN) ?? '15m';
    const refreshExpiry = this.configService.get(Config.JWT_REFRESH_EXPIRES_IN) ?? '7d';

    const accessToken = this.jwt.createToken(
      { sub: user.id, email: user.email, roles: user.roles },
      this.getAccessSecret(),
      { expiresIn: accessExpiry } as any,
    );
    const refreshToken = this.jwt.createToken(
      { sub: user.id, email: user.email, roles: user.roles, type: 'refresh' },
      this.getRefreshSecret(),
      { expiresIn: refreshExpiry } as any,
    );

    return { accessToken, refreshToken };
  }

  private getAccessSecret(): string {
    return this.configService.getOrThrow(Config.JWT_SECRET);
  }

  private getRefreshSecret(): string {
    return this.configService.getOrThrow(Config.JWT_REFRESH_SECRET);
  }

  /** Loguea un login fallido sin revelar si el email existe. */
  private async failLogin(email: string): Promise<void> {
    this.logger.warn(`Login fallido para email ${email}`);
  }
}