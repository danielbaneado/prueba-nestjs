import { Vehicle } from '../vehicle.entity.js';

export class VehicleDao {
  private vehicles: Vehicle[] = [];
  private counter = 0;

  async findAll(): Promise<Vehicle[]> {
    return [...this.vehicles];
  }

  async findById(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.find((v) => v.id === id);
  }

  async findByPlate(plate: string): Promise<Vehicle | undefined> {
    return this.vehicles.find((v) => v.plate === plate);
  }

  async create(data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const now = new Date();
    const vehicle: Vehicle = {
      ...data,
      id: String(++this.counter),
      createdAt: now,
      updatedAt: now,
    } as Vehicle;
    this.vehicles.push(vehicle);
    return vehicle;
  }

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const idx = this.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return undefined;
    this.vehicles[idx] = { ...this.vehicles[idx], ...data, updatedAt: new Date() };
    return this.vehicles[idx];
  }

  clear(): void {
    this.vehicles = [];
    this.counter = 0;
  }
}
