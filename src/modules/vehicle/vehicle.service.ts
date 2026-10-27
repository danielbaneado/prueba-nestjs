import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Vehicle } from './vehicle.entity.js';
import { VehicleDao } from './dao/vehicle.dao.js';
import { VehicleStates } from '../../common/enums/domain.enums.js';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleDao: VehicleDao) {}

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleDao.findAll();
  }

  async findById(id: string): Promise<Vehicle | undefined> {
    return this.vehicleDao.findById(id);
  }

  async findByPlate(plate: string): Promise<Vehicle | undefined> {
    return this.vehicleDao.findByPlate(plate);
  }

  async create(data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const existing = await this.vehicleDao.findByPlate(data.plate);
    if (existing) throw new ConflictException('Plate already registered');
    return this.vehicleDao.create(data);
  }

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = await this.vehicleDao.findById(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.state=== VehicleStates.INACTIVE) throw new BadRequestException("This vehicle is inactive, cannot modify")
    const updated = await this.vehicleDao.update(id, data);
    return updated as Vehicle;
  }

  async inactivate(id: string): Promise<Vehicle> {
    return this.update(id, { state: VehicleStates.INACTIVE });
  }
}
