import { Injectable, NotFoundException } from '@nestjs/common';
import { Maintenance } from './maintenance.entity.js';
import { MaintenanceDao } from './dao/maintenance.dao.js';

@Injectable()
export class MaintenanceService {
  constructor(private readonly dao: MaintenanceDao) {}

  async findAll(): Promise<Maintenance[]> { 
    return this.dao.findAll(); 
  }
  async findById(id: string): Promise<Maintenance | undefined> { 
    return this.dao.findById(id); 
  }
  async findByVehicle(vehicleId: string): Promise<Maintenance[]> { 
    return this.dao.findByVehicle(vehicleId); 
  }
  async findByMechanic(mechanicId: string): Promise<Maintenance[]> { 
    return this.dao.findByMechanic(mechanicId); 
  }

  async create(data: Partial<Maintenance>): Promise<Maintenance> {
    return this.dao.create(data);
  }

  async updateState(id: string, state: Maintenance['state']): Promise<Maintenance> {
    const m = await this.dao.findById(id);
    if (!m) throw new NotFoundException('Maintenance not found');
    return (await this.dao.update(id, { state })) as Maintenance;
  }
}
