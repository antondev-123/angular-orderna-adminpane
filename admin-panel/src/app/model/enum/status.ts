import isEnumValue from '@orderna/admin-panel/src/utils/is-enum-value';

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export const isStatus = (value: any) => isEnumValue(Status, value);

export interface WithStatus {
  status: Status;
}
