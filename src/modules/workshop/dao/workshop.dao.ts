import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop } from '../workshop.entity.js';

export class WorkshopDao {
  constructor(@InjectRepository(Workshop) private readonly repo: Repository<Workshop>) {}

  async findAll(): Promise<Workshop[]> { 
    return this.repo.find(); 
  }
  async findById(id: string): Promise<Workshop | undefined> { 
    return (await this.repo.findOne({ where: { id } })) ?? undefined; 
  }
  async create(data: Omit<Workshop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workshop> {
    const entity = this.repo.create(data as any);
    return this.repo.save(entity) as any;
  }
  async update(id: string, data: Partial<Workshop>): Promise<Workshop | undefined> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }
}
