import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mechanic } from '../mechanic.entity.js';

export class MechanicDao {
  constructor(@InjectRepository(Mechanic) private readonly repo: Repository<Mechanic>) {}

  async findAll(): Promise<Mechanic[]> { 
    return this.repo.find(); 
  }
  async findById(id: string): Promise<Mechanic | undefined> {
    return (await this.repo.findOne({ where: { id } })) ?? undefined; 
  }
  async findByEmail(email: string): Promise<Mechanic | undefined> { 
    return (await this.repo.findOne({ where: { email } })) ?? undefined; 
  }
  async create(data: Omit<Mechanic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mechanic> {
    const entity = this.repo.create(data as any);
    return this.repo.save(entity) as any;
  }
  async update(id: string, data: Partial<Mechanic>): Promise<Mechanic | undefined> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }
}
