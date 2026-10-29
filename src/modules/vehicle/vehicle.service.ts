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

  /**
   * Actualiza un vehicle. Los vehículos inactivos solo pueden cambiar su estado
   (reactivación); no se permiten otras modificaciones.
   */
  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = await this.vehicleDao.findById(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    // Si el vehicle está inactivado, solo se permite cambiar el estado a AVAILABLE.
    if (vehicle.state === VehicleStates.INACTIVE) {
      const keys = Object.keys(data);
      if (keys.length !== 1 || keys[0] !== 'state' || data.state !== VehicleStates.AVAILABLE) {
        throw new BadRequestException('Inactive vehicle can only be reactivated');
      }
    }

    const updated = await this.vehicleDao.update(id, data);
    if (!updated) throw new NotFoundException('Vehicle not found after update');
    return updated;
  }

  /** Desactiva un vehicle (idempotente). */
  async inactivate(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleDao.findById(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.state === VehicleStates.INACTIVE) return vehicle;
    const updated = await this.vehicleDao.update(id, { state: VehicleStates.INACTIVE });
    if (!updated) throw new NotFoundException('Vehicle not found after inactivation');
    return updated;
  }

  /** Reactiva un vehicle (idempotente). */
  async activate(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleDao.findById(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.state === VehicleStates.AVAILABLE) return vehicle;
    const updated = await this.vehicleDao.update(id, { state: VehicleStates.AVAILABLE });
    if (!updated) throw new NotFoundException('Vehicle not found after activation');
    return updated;
  }
}