import { Exclude } from 'class-transformer';
import { UserRoles } from '../../common/enums/domain.enums.js';

// Re-exporta el enum para que los módulos de dominio puedan importarlo
// desde `user.entity` sin tener que llegar a `common/enums`.
export { UserRoles };

/**
 * Modelo de usuario.
 *
 * NOTA: Esta es una interfaz simple mientras la base de datos no esté conectada.
 * Cuando se migre a TypeORM, reemplazar por una Entity con decoradores
 * (@Entity, @Column, @PrimaryGeneratedColumn, etc.) y un Repository.
 */
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  roles: UserRoles[];
  failedAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Versión segura de User que nunca expone el passwordHash.
 *
 * Se usa como DTO de respuesta. El decorador `@Exclude()` (de class-transformer)
 * se aplica a la clase para que, al serializar con `plainToInstance`, se
 * omitan automáticamente los campos marcados como `@Exclude()` en la Entity.
 */
@Exclude()
export class UserResponse {
  id: string;
  email: string;
  roles: UserRoles[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    this.id = partial.id as string;
    this.email = partial.email as string;
    this.roles = partial.roles as UserRoles[];
    this.createdAt = partial.createdAt as Date;
    this.updatedAt = partial.updatedAt as Date;
  }
}