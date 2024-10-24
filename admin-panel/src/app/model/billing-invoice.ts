import { BillingInterval } from './enum/billing-interval';
import { UserProfile } from './user-profile';

export interface IBillingInvoice {
  id: number;
  profile: UserProfile;
  paymentMethod: string;
  billingInterval: BillingInterval;
  vat: string;
  userAddress: string;
  billingAddress: string;
  invoiceList: string;
}

export type BillingIntervalUpdateData = Pick<
  IBillingInvoice,
  'id' | 'billingInterval'
>;

export class BillingInvoice implements IBillingInvoice {
  id: number;
  profile: UserProfile;
  paymentMethod: string;
  billingInterval: BillingInterval;
  vat: string;
  userAddress: string;
  billingAddress: string;
  invoiceList: string;

  constructor({
    id = 0,
    profile = new UserProfile({}),
    paymentMethod = '',
    billingInterval = BillingInterval.ANNUALLY,
    vat = '',
    userAddress = '',
    billingAddress = '',
    invoiceList = '',
  }: Partial<BillingInvoice>) {
    this.id = id;
    this.profile = profile;
    this.paymentMethod = paymentMethod;
    this.billingInterval = billingInterval;
    this.billingAddress = billingAddress;
    this.vat = vat;
    this.userAddress = userAddress;
    this.invoiceList = invoiceList;
  }
}
