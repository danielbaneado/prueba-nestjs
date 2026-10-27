import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { Jwt } from '../utils/jwt.js';
import { Config, ConfigService } from '../../config/config.service.js';

/**
 * Autenticación por cookie de sessión (access token).
 *
 * Lee la cookie `session_token`, la verifica con `Jwt.verifyToken` y coloca
 * el payload en `request.user` para que `@CurrentUser` y `RolesGuard` lo usen.
 */
@Injectable()
export class JwtGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(
    private readonly jwt: Jwt,
    configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    this.jwtSecret = configService.getOrThrow(Config.JWT_SECRET);
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const request = ctx.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }

    const payload = await this.jwt.verifyToken(token, this.jwtSecret);
    if (!payload) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    (request as any).user = payload;
    return true;
  }

  /**
   * Acepta el token por cookie `session_token` o por header `Authorization: Bearer <token>`.
   * El header es útil para testing y para clients que no manejan cookies.
   */
  private extractToken(request: Request): string | undefined {
    const cookies = (request as any).cookies as Record<string, string> | undefined;
    const cookieToken = cookies?.session_token;
    if (cookieToken) return cookieToken;

    const authHeader = (request.headers as any).authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice('Bearer '.length);
    }

    return undefined;
  }
}