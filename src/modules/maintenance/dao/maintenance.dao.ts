import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maintenance } from '../maintenance.entity.js';

export class MaintenanceDao {
  constructor(@InjectRepository(Maintenance) private readonly repo: Repository<Maintenance>) {}

  async findAll(): Promise<Maintenance[]> { 
    return this.repo.find(); 
  }
  async findById(id: string): Promise<Maintenance | undefined> { 
    return (await this.repo.findOne({ where: { id } })) ?? undefined; 
  }
  async findByVehicle(vehicleId: string): Promise<Maintenance[]> { 
    return this.repo.find({ where: { vehicleId } }); 
  }
  async findByMechanic(mechanicId: string): Promise<Maintenance[]> { 
    return this.repo.find({ where: { mechanicId } }); 
  }
  async create(data: Partial<Maintenance>): Promise<Maintenance> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
  async update(id: string, data: Partial<Maintenance>): Promise<Maintenance | undefined> {
    await this.repo.update(id, data);
    return this.findById(id);
  }
}
