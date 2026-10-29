import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { MaintenanceDao } from './dao/maintenance.dao.js';
import { Maintenance as MaintenanceEntity } from './maintenance.entity.js';
import { VehicleService } from '../vehicle/vehicle.service.js';
import { MechanicService } from '../mechanic/mechanic.service.js';
import { WorkshopService } from '../workshop/workshop.service.js';
import { VehicleStates } from '../../common/enums/domain.enums.js';
import { MaintenanceStates } from '../../common/enums/domain.enums.js';

@Injectable()
export class MaintenanceService {
  constructor(
    private readonly dao: MaintenanceDao,
    private readonly vehicleService: VehicleService,
    private readonly mechanicService: MechanicService,
    private readonly workshopService: WorkshopService,
  ) {}

  async findAll(): Promise<MaintenanceEntity[]> { return this.dao.findAll(); }
  async findById(id: string): Promise<MaintenanceEntity | undefined> { return this.dao.findById(id); }
  async findByVehicle(vehicleId: string): Promise<MaintenanceEntity[]> { return this.dao.findByVehicle(vehicleId); }
  async findByMechanic(mechanicId: string): Promise<MaintenanceEntity[]> { return this.dao.findByMechanic(mechanicId); }

  private async validateCreate(data: any) {
    const vehicle = await this.vehicleService.findById(data.vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.state === VehicleStates.INACTIVE) throw new BadRequestException('Vehicle inactive');
    const mechanic = await this.mechanicService.findById(data.mechanicId);
    if (!mechanic) throw new NotFoundException('Mechanic not found');
    if (!mechanic.active) throw new BadRequestException('Mechanic inactive');
    const workshop = await this.workshopService.findById(data.workshopId);
    if (!workshop) throw new NotFoundException('Workshop not found');
    if (!workshop.active) throw new BadRequestException('Workshop inactive');

    const activeStates = [MaintenanceStates.SCHEDULED, MaintenanceStates.IN_PROGRESS];
    const vehicleActive = await this.dao.findByVehicle(data.vehicleId);
    if (vehicleActive.some((m) => activeStates.includes(m.state))) {
      throw new ConflictException('Vehicle already has active maintenance');
    }
    const mechanicActive = await this.dao.findByMechanic(data.mechanicId);
    if (mechanicActive.some((m) => activeStates.includes(m.state))) {
      throw new ConflictException('Mechanic already has active maintenance');
    }

    if (data.mileage < vehicle.mileage) throw new BadRequestException('Mileage cannot be lower than vehicle mileage');
  }

  async create(data: any): Promise<MaintenanceEntity> {
    await this.validateCreate(data);
    return this.dao.create(data);
  }

  async updateState(id: string, state: MaintenanceStates, closing?: any): Promise<MaintenanceEntity> {
    const m = await this.dao.findById(id);
    if (!m) throw new NotFoundException('Maintenance not found');

    if (m.state === MaintenanceStates.COMPLETED) throw new BadRequestException('Completed maintenance cannot change state');
    if (m.state === MaintenanceStates.CANCELLED && (state === MaintenanceStates.IN_PROGRESS || state === MaintenanceStates.COMPLETED)) {
      throw new BadRequestException('Cancelled maintenance cannot change to in progress or completed');
    }

    if (state === MaintenanceStates.COMPLETED) {
      if (!closing?.workPerformed || closing?.finalCost == null || !closing?.completionDate || closing?.finalMileage == null) {
        throw new BadRequestException('Missing closing information');
      }
      await this.dao.update(id, {
        state,
        workPerformed: closing.workPerformed,
        finalCost: closing.finalCost,
        completionDate: new Date(closing.completionDate),
        finalMileage: closing.finalMileage,
      });
      await this.vehicleService.update(m.vehicleId, { state: VehicleStates.AVAILABLE });
      return (await this.dao.findById(id)) as MaintenanceEntity;
    }

    if (state === MaintenanceStates.IN_PROGRESS) {
      await this.dao.update(id, { state });
      await this.vehicleService.update(m.vehicleId, { state: VehicleStates.IN_MAINTENANCE });
      return (await this.dao.findById(id)) as MaintenanceEntity;
    }

    await this.dao.update(id, { state });
    return (await this.dao.findById(id)) as MaintenanceEntity;
  }
}
