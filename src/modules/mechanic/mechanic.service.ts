import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Mechanic } from './mechanic.entity.js';
import { MechanicDao } from './dao/mechanic.dao.js';

@Injectable()
export class MechanicService {
  constructor(private readonly dao: MechanicDao) {}

  async findAll(): Promise<Mechanic[]> { return this.dao.findAll(); }
  async findById(id: string): Promise<Mechanic | undefined> { return this.dao.findById(id); }

  async create(data: Omit<Mechanic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mechanic> {
    const existing = await this.dao.findByEmail(data.email);
    if (existing) throw new ConflictException('Email already registered');
    return this.dao.create(data);
  }

  async update(id: string, data: Partial<Mechanic>): Promise<Mechanic> {
    const m = await this.dao.findById(id);
    if (!m) throw new NotFoundException('Mechanic not found');
    return (await this.dao.update(id, data)) as Mechanic;
  }

  async inactivate(id: string): Promise<Mechanic> {
    return this.update(id, { active: false });
  }

  async activate(id: string): Promise<Mechanic> {
    return this.update(id, { active: true });
  }
}
