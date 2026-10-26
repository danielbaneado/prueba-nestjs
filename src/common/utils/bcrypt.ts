import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

/**
 * Wrapper tipado alrededor de `bcrypt` (hash/compare de contraseñas).
 *
 * `bcrypt@6` es ESM-only y asíncrónico: `hash` y `compare` devuelven Promises.
 */
@Injectable()
export class Bcrypt {
  /**
   * Hashea una contraseña en texto plano con el número de rounds indicado.
   * El valor de `saltRounds` debe coincidir con `SALT_ROUNDS` (default 10).
   */
  hashPassword(password: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compara una contraseña en texto plano con un hash guardado.
   * Devuelve `true` si coinciden, `false` en caso contrario.
   */
  comparePassword(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashedPassword);
  }
}