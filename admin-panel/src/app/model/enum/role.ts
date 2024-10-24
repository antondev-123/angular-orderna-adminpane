import isEnumValue from '@orderna/admin-panel/src/utils/is-enum-value';

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier',
}

export const isRole = (value: any) => isEnumValue(Role, value);
