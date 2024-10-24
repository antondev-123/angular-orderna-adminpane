import isEnumValue from '@orderna/admin-panel/src/utils/is-enum-value';

export enum DateFilter {
  TODAY = 'today',
  LAST_7_DAYS = 'last_7_days',
  LAST_4_WEEKS = 'last_4_weeks',
  LAST_12_MONTHS = 'last_12_months',
  MAX = 'max',
}

export const isDateFilter = (value: any) => isEnumValue(DateFilter, value);
