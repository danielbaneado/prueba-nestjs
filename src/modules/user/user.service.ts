import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Config, ConfigService } from '../../config/config.service.js';
import { Bcrypt } from '../../common/utils/bcrypt.js';
import { Password } from '../../common/utils/password.js';
import { User, UserResponse } from './user.entity.js';
import { UserDao } from './dao/user.dao.js';

/**
 * Servicio de gestión de usuarios.
 *
 * Usa `Bcrypt` para hashear/compare contraseñas, `Password` para validar
 * fortaleza, y `UserStore` como capa de persistencia (placeholder para TypeORM).
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userDao: UserDao,
    private readonly bcrypt: Bcrypt,
    private readonly password: Password,
    private readonly configService: ConfigService,
  ) {}

  /** Crea un usuario nuevo. Lanza `ConflictException` si el email ya existe. */
  async create(email: string, rawPassword: string, roles: User['roles']): Promise<UserResponse> {
    const existing = await this.userDao.findByEmail(email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    // Validar fortaleza de la contraseña antes de hashear.
    if (!this.password.validatePassword(rawPassword)) {
      throw new ConflictException('La contraseña no cumple las políticas de seguridad');
    }

    const saltRounds = this.configService.getNumber(Config.SALT_ROUNDS) ?? 10;
    const passwordHash = await this.bcrypt.hashPassword(rawPassword, saltRounds);

    const user = await this.userDao.create({
      email,
      passwordHash,
      roles,
      failedAttempts: 0,
      lockedUntil: null,
    });

    return new UserResponse(user);
  }

  /** Busca un usuario por email (incluye el hash, solo para uso interno). */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userDao.findByEmail(email);
  }

  /** Busca un usuario por id y devuelve la versión segura. */
  async findById(id: string): Promise<UserResponse | undefined> {
    const user = await this.userDao.findById(id);
    return user ? new UserResponse(user) : undefined;
  }

  /** Marca un usuario como bloqueado por `durationMs` milisegundos. */
  async lockUser(id: string, durationMs: number): Promise<void> {
    const lockedUntil = new Date(Date.now() + durationMs);
    await this.userDao.update(id, { lockedUntil });
  }

  /** Reinicia los intentos fallidos y el bloqueo de un usuario. */
  async resetFailures(id: string): Promise<void> {
    await this.userDao.update(id, { failedAttempts: 0, lockedUntil: null });
  }

  /** Incrementa los intentos fallidos; bloquea el usuario si supera el límite. */
  async recordFailedAttempt(id: string): Promise<void> {
    const user = await this.userDao.findById(id);
    if (!user) return;

    const maxAttempts = this.configService.getNumber(Config.MAX_FAILED_ATTEMPTS) ?? 5;
    const next = user.failedAttempts + 1;

    if (next >= maxAttempts) {
      // Bloqueo de 15 minutos.
      const lockMs = 15 * 60 * 1000;
      await this.userDao.update(id, {
        failedAttempts: next,
        lockedUntil: new Date(Date.now() + lockMs),
      });
      this.logger.warn(`Usuario ${user.email} bloqueado por ${lockMs}ms (${next}/${maxAttempts} intentos)`);
    } else {
      await this.userDao.update(id, { failedAttempts: next });
    }
  }

  /** Lista todos los usuarios (solo ADMIN). */
  async findAll(): Promise<User[]> {
    return this.userDao.findAll();
  }
}