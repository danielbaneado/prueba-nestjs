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
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
  async update(id: string, data: Partial<User>): Promise<User | undefined> {
    await this.repo.update(id, data);
    return this.findById(id);
  }
  async delete(id: string): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected ?? 0) > 0;
  }
  async count(): Promise<number> {
    return this.repo.count();
  }
}
