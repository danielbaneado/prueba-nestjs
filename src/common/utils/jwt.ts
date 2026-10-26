import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

/**
 * Utilidades para crear y verificar JWT (access/refresh tokens).
 *
 * `createToken` es síncrono (jwt.sign lo es). `verifyToken` es asíncrono y
 * **no lanza**: devuelve `null` cuando el token es inválido, expirado o
 * tamperado, para que el caller pueda tratarlo como un rechazo limpio.
 */
@Injectable()
export class Jwt {
  /**
   * Crea un JWT con un `jwtid` único (randomUUID) por token, para permitir
   * revocación individual por jti.
   */
  createToken(payload: JwtPayload, jwtSecret: string, options: SignOptions): string {
    return jwt.sign(payload, jwtSecret, { ...options, jwtid: randomUUID() });
  }

  /**
   * Verifica un JWT. Devuelve el payload si es válido; `null` si no.
   * Nunca lanza: cualquier error de verificación se traduce en `null`.
   */
  async verifyToken(token: string, jwtSecret: string): Promise<JwtPayload | null> {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      return typeof decoded === 'object' ? (decoded as JwtPayload) : null;
    } catch {
      return null;
    }
  }
}