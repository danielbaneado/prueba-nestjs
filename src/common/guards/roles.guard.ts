import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Lee los roles requeridos por el decorador `@Roles(...)` (almacenados por
 * `SetMetadata` bajo la clave `ROLES_KEY`) y verifica que el usuario
 * autenticado tenga al menos uno de ellos.
 *
 * Debe usarse después de `JwtGuard` (que coloca `request.user`).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      ctx.getHandler(),
    );

    // Sin roles requeridos → permitido.
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    const userRoles: string[] = Array.isArray(user.roles) ? user.roles : [];
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}