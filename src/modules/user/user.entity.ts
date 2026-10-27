import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsArray, IsEnum, IsUUID } from 'class-validator';
import { UserRoles } from '../../common/enums/domain.enums.js';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRoles, array: true, default: [UserRoles.TECHNICIAN] })
  roles: UserRoles[];

  @Column({ name: 'failed_attempts', default: 0 })
  failedAttempts: number;

  @Column({ name: 'locked_until', type: 'timestamp', nullable: true })
  lockedUntil: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
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
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsArray()
  @IsEnum(UserRoles, { each: true })
  roles: UserRoles[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    this.id = partial.id as string;
    this.email = partial.email as string;
    this.roles = partial.roles as UserRoles[];
    this.createdAt = partial.createdAt as Date;
    this.updatedAt = partial.updatedAt as Date;
  }
}
export { UserRoles };
