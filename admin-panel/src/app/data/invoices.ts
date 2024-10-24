import { Invoice } from '../model/invoice';
import { BILLING_INVOICES } from './billing-invoices';

let count = 1;
export const INVOICES = BILLING_INVOICES.reduce((acc: Invoice[], billing) => {
  acc.push(
    {
      id: count,
      billingInvoice: billing,
      yearSubscribed: 2020,
      planType: 'Basic Plan - Annualy',
      amountPaid: 349.0,
    },
    {
      id: count + 1,
      billingInvoice: billing,
      yearSubscribed: 2021,
      planType: 'Basic Plan - Annualy',
      amountPaid: 349.0,
    }
  );

  count = count + 2;
  return acc;
}, []);
