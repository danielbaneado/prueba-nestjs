import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../vehicle/vehicle.entity.js';
import { Mechanic } from '../mechanic/mechanic.entity.js';
import { Workshop } from '../workshop/workshop.entity.js';
import { MaintenanceTypes, MaintenanceStates } from '../../common/enums/domain.enums.js';

@Entity('maintenances')
export class Maintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MaintenanceTypes })
  type: MaintenanceTypes;

  @Column()
  description: string;

  @Column()
  mileage: number;

  @Column({ name: 'scheduled_date', type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'enum', enum: MaintenanceStates, default: MaintenanceStates.SCHEDULED })
  state: MaintenanceStates;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  @ManyToOne(() => Mechanic)
  @JoinColumn({ name: 'mechanic_id' })
  mechanic: Mechanic;

  @Column({ name: 'mechanic_id' })
  mechanicId: string;

  @ManyToOne(() => Workshop)
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  @Column({ name: 'workshop_id' })
  workshopId: string;

  @Column({ name: 'work_performed', nullable: true })
  workPerformed?: string;

  @Column({ name: 'final_cost', type: 'numeric', nullable: true })
  finalCost?: number;

  @Column({ name: 'completion_date', type: 'timestamp', nullable: true })
  completionDate?: Date;

  @Column({ name: 'final_mileage', nullable: true })
  finalMileage?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
