import { PaymentType } from '../../app/model/enum/payment-type';

export const PAYMENT_TYPE_LABELS = {
  [PaymentType.CASH]: 'Cash',
  [PaymentType.CREDIT_CARD]: 'Credit Card',
  [PaymentType.DEBIT_CARD]: 'Debit Card',
  [PaymentType.GCASH]: 'GCash',
};
