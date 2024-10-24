import isEnumValue from '@orderna/admin-panel/src/utils/is-enum-value';

export enum TransactionType {
  IN_STORE = 'in_store',
  ONLINE = 'online',
  DELIVERY = 'delivery',
  PICK_UP = 'pick_up',
  COUNTER = 'counter',
}

export const isTransactionType = (value: any) =>
  isEnumValue(TransactionType, value);
