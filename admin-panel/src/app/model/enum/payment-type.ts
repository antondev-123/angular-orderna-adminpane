import isEnumValue from '@orderna/admin-panel/src/utils/is-enum-value';

export enum PaymentType {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  GCASH = 'gcash',
}

export const PAYMENT_TYPE_OPTIONS = [
  {
    label: 'Cash',
    value: PaymentType.CASH,
  },
  {
    label: 'Credit Card',
    value: PaymentType.CREDIT_CARD,
  },
  {
    label: 'Debit Card',
    value: PaymentType.DEBIT_CARD,
  },
  {
    label: 'Gcash',
    value: PaymentType.GCASH,
  },
];

export const isPaymentType = (value: any) => isEnumValue(PaymentType, value);

export interface WithPaymentType {
  paymentType: PaymentType;
}
