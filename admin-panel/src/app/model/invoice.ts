import { BillingInvoice } from './billing-invoice';
import { User } from './user';

export interface IInvoice {
  id: number;
  billingInvoice: BillingInvoice;
  yearSubscribed: number;
  planType: string;
  amountPaid: number;
}

export class Invoice implements IInvoice {
  id: number;
  billingInvoice: BillingInvoice;
  yearSubscribed: number;
  planType: string;
  amountPaid: number;

  constructor({
    id = 0,
    billingInvoice = new BillingInvoice({}),
    yearSubscribed = 2024,
    planType = '',
    amountPaid = 0,
  }: Partial<Invoice>) {
    this.id = id;
    this.billingInvoice = billingInvoice;
    this.yearSubscribed = yearSubscribed;
    this.planType = planType;
    this.amountPaid = amountPaid;
  }
}
