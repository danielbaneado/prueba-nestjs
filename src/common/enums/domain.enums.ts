export enum UserRoles {
  ADMIN= 'admin',
  USUARIO= 'usuario'
}

export const enumValues = <T extends Record<string, string>>(e: T): Array<T[keyof T]> =>
  Object.values(e) as Array<T[keyof T]>;
