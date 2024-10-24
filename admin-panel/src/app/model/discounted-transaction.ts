import { Customer } from './customer';
import { TransactionType } from './enum/transaction-type';

export interface IDiscountedTransaction {
  id: number;
  transactionDate: Date;
  code: string;
  type: TransactionType;
  customer: Customer;
  transactionNumber: string;
  transactionTotal: number;
  discountAmount: number;
}

export class DiscountedTransaction implements IDiscountedTransaction {
  id: number;
  transactionDate: Date;
  code: string;
  type: TransactionType;
  customer: Customer;
  transactionNumber: string;
  transactionTotal: number;
  discountAmount: number;

  constructor(
    id = 0,
    transactionDate = new Date(),
    code = '',
    type = TransactionType.COUNTER,
    customer = new Customer(),
    transactionNumber = '',
    transactionTotal = 0,
    discountAmount = 0
  ) {
    this.id = id;
    this.transactionDate = transactionDate;
    this.code = code;
    this.type = type;
    this.customer = customer;
    this.transactionNumber = transactionNumber;
    this.transactionTotal = transactionTotal;
    this.discountAmount = discountAmount;
  }
}
