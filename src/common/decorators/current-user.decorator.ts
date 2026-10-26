import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * Parámetro de request que expone el usuario autenticado (inyectado por el
 * guard de autenticación en `request.user`).
 *
 * Uso: `@CurrentUser() user: User`
 *
 * Nota: `createParamDecorator` aún funciona en Nest 12, pero la forma
 * recomendada hoy es usar un factory simple con `Context`/`createParamDecorator`
 * del mismo módulo. Si en el futuro se migra a un guard que coloca el usuario
 * en otra ubicación, cambiar solo este archivo.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);