import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../vehicle.entity.js';

export class VehicleDao {
  constructor(@InjectRepository(Vehicle) private readonly repo: Repository<Vehicle>) {}

  async findAll(): Promise<Vehicle[]> {
    return this.repo.find();
  }
  async findById(id: string): Promise<Vehicle | undefined> {
    return (await this.repo.findOne({ where: { id } })) ?? undefined;
  }
  async findByPlate(plate: string): Promise<Vehicle | undefined> {
    return (await this.repo.findOne({ where: { plate } })) ?? undefined;
  }
  async create(data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle | undefined> {
    await this.repo.update(id, data);
    return this.findById(id);
  }
}