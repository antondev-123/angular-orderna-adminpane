import { TransactionType } from '../../app/model/enum/transaction-type';

export const TRANSACTION_TYPE_LABELS = {
  [TransactionType.IN_STORE]: 'In Store',
  [TransactionType.ONLINE]: 'Online',
  [TransactionType.DELIVERY]: 'Delivery',
  [TransactionType.PICK_UP]: 'Pick Up',
  [TransactionType.COUNTER]: 'Counter',
};

export const TRANSACTION_TYPE_DESCRIPTIONS = {
  [TransactionType.IN_STORE]: 'Transactions that occur via QR code',
  [TransactionType.ONLINE]: 'Transactions that are completed online',
  [TransactionType.DELIVERY]:
    'Transactions where items are delivered to the customer',
  [TransactionType.PICK_UP]:
    'Transactions where customers pick up items from a store',
  [TransactionType.COUNTER]:
    'Transactions completed at a counter within a store',
};

export const TRANSACTION_TYPE_ICONS = {
  [TransactionType.IN_STORE]: 'stores',
  [TransactionType.ONLINE]: 'online',
  [TransactionType.DELIVERY]: 'motorcycle',
  [TransactionType.PICK_UP]: 'pick-up',
  [TransactionType.COUNTER]: 'cash-register',
};
