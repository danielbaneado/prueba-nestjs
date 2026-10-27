import { Injectable, NotFoundException } from '@nestjs/common';
import { Workshop } from './workshop.entity.js';
import { WorkshopDao } from './dao/workshop.dao.js';

@Injectable()
export class WorkshopService {
  constructor(private readonly dao: WorkshopDao) {}

  async findAll(): Promise<Workshop[]> { return this.dao.findAll(); }
  async findById(id: string): Promise<Workshop | undefined> { return this.dao.findById(id); }

  async create(data: Omit<Workshop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workshop> {
    return this.dao.create(data);
  }

  async update(id: string, data: Partial<Workshop>): Promise<Workshop> {
    const w = await this.dao.findById(id);
    if (!w) throw new NotFoundException('Workshop not found');
    return (await this.dao.update(id, data)) as Workshop;
  }

  async inactivate(id: string): Promise<Workshop> {
    return this.update(id, { active: false });
  }

  async activate(id: string): Promise<Workshop> {
    return this.update(id, { active: true });
  }
}
