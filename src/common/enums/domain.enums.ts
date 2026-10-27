export enum UserRoles {
  ADMIN= 'admin',
  TECHNICIAN= 'technician'
}

export enum VehicleStates {
  AVAILABLE = "available",
  IN_MAINTENANCE = "in_maintenance",
  INACTIVE = "inactive"
}

export enum MaintenanceStates{
  SCHEDULED= "scheduled",
  IN_PROGRESS= "in_progress",
  COMPLETED= "completed",
  CANCELLED= "cancelled"
}

export enum MaintenanceTypes{
  PREVENTIVE= "preventive",
  CORRECTIVE= "corrective"
}

export const enumValues = <T extends Record<string, string>>(e: T): Array<T[keyof T]> =>
  Object.values(e) as Array<T[keyof T]>;
