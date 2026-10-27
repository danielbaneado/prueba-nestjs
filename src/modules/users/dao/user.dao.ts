import { User } from '../user.entity.js';
import { UserStore } from '../user.store.js';

/**
 * DAO de usuarios: acceso a datos sin lógica de negocio.
 * Delega en `UserStore` (placeholder para TypeORM/Prisma).
 */
export class UserDao {
  constructor(private readonly store: UserStore) {}

  async findById(id: string): Promise<User | undefined> {
    return this.store.findById(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.store.findByEmail(email);
  }

  async findAll(): Promise<User[]> {
    return this.store.findAll();
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.store.create(data);
  }

  async update(id: string, data: Partial<User>): Promise<User | undefined> {
    return this.store.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  count(): number {
    return this.store.count();
  }

  clear(): void {
    this.store.clear();
  }
}
