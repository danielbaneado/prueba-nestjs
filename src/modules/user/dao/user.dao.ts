import { User } from '../user.entity.js';

export class UserDao {
  private users: User[] = [];
  private counter = 0;

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    const user: User = {
      ...data,
      id: String(++this.counter),
      createdAt: now,
      updatedAt: now,
    } as User;
    this.users.push(user);
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User | undefined> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.users[idx] = { ...this.users[idx], ...data, updatedAt: new Date() };
    return this.users[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    return true;
  }

  count(): number {
    return this.users.length;
  }

  clear(): void {
    this.users = [];
    this.counter = 0;
  }
}
