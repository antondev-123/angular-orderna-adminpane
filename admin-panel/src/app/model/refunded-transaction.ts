import { Customer } from './customer';
import { TransactionType } from './enum/transaction-type';

export interface IRefundedTransaction {
  id: number;
  transactionDate: Date;
  customer: Customer;
  transactionNumber: string;
  transactionTotal: number;
  refund: number;
  reason: string;
}

export class RefundedTransaction implements IRefundedTransaction {
  id: number;
  transactionDate: Date;
  customer: Customer;
  transactionNumber: string;
  transactionTotal: number;
  refund: number;
  reason: string;

  constructor(
    id = 0,
    transactionDate = new Date(),
    customer = new Customer(),
    transactionNumber = '',
    transactionTotal = 0,
    refund = 0,
    reason = ''
  ) {
    this.id = id;
    this.transactionDate = transactionDate;
    this.customer = customer;
    this.transactionNumber = transactionNumber;
    this.transactionTotal = transactionTotal;
    this.refund = refund;
    this.reason = reason;
  }
}
