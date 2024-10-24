import isEnumValue from '@orderna/admin-panel/src/utils/is-enum-value';

export enum DateGroup {
  NONE = 'none',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export const isDateFilter = (value: any) => isEnumValue(DateGroup, value);
