import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity.js';

/**
 * Store in-memory de usuarios.
 *
 * PLACEHOLDER: mientras la base de datos no esté conectada, los usuarios
 * viven en memoria del proceso (se pierden al reiniciar y no escala a
 * cluster/serverless). Cuando se migre a TypeORM, reemplazar por un
 * `UserRepository` (por ejemplo `UserRepository extends Repository<User>`).
 */
export class UserStore {
  private readonly users = new Map<string, User>();

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    const updated: User = { ...existing, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  /** Cuenta todos los usuarios guardados. */
  count(): number {
    return this.users.size;
  }

  /** Lista todos los usuarios. */
  findAll(): User[] {
    return Array.from(this.users.values());
  }

  /** Limpia todos los usuarios (solo para testing). */
  clear(): void {
    this.users.clear();
  }
}