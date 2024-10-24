import isEnumValue from '@orderna/admin-panel/src/utils/is-enum-value';

export enum DiscountStatus {
  ARCHIVED = 'archived',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SCHEDULED = 'scheduled',
}

export const isDiscountStatus = (value: any) =>
  isEnumValue(DiscountStatus, value);
