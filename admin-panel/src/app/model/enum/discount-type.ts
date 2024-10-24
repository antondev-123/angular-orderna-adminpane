import isEnumValue from '@orderna/admin-panel/src/utils/is-enum-value';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export const isDiscountType = (value: any) => isEnumValue(DiscountType, value);
