import isEnumValue from '@orderna/admin-panel/src/utils/is-enum-value';

export enum TransactionStatus {
  REFUNDED = 'refunded',
  APPROVED = 'approved',
  PENDING = 'pending',
  FAIL = 'fail',
  COMPLETED = 'completed',
  VOID = 'void',
  PARKED = 'parked',
}

export const isTransactionStatus = (value: any) =>
  isEnumValue(TransactionStatus, value);
