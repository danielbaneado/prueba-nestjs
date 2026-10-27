import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity.js';

export class UserDao {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async findById(id: string): Promise<User | undefined> {
    return (await this.repo.findOne({ where: { id } })) ?? undefined;
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return (await this.repo.findOne({ where: { email } })) ?? undefined;
  }
  async findAll(): Promise<User[]> {
    return this.repo.find();
  }
  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const entity = this.repo.create(data as any);
    return this.repo.save(entity) as any;
  }
  async update(id: string, data: Partial<User>): Promise<User | undefined> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }
  async delete(id: string): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected ?? 0) > 0;
  }
  count(): number { return 0; }
}
