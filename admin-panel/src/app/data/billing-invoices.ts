import {
  getRandomEnumValue,
  getRandomItem,
  getRandomItems,
} from '../../utils/dummy-data';
import { BillingInvoice } from '../model/billing-invoice';
import { BillingInterval } from '../model/enum/billing-interval';
import { USER_PROFILES } from './user-profiles';

export const BILLING_INVOICES = USER_PROFILES.reduce(
  (acc: BillingInvoice[], profile) => {
    acc.push({
      id: profile.id,
      profile,
      paymentMethod: getRandomItem([
        'Mastercard ending 9282',
        'Mastercard ending 7722',
        'Mastercard ending 7280',
      ]),
      vat: getRandomItem(['UK849700927', 'UK569330998']),
      billingInterval: getRandomEnumValue(BillingInterval),
      billingAddress: getRandomItem(['hello@cruip.com', 'hello@drip.com']),
      invoiceList: '',
      userAddress: getRandomItem([
        '34 Savoy Street, London, UK, 24E8X',
        '14 Savoy Street, London, UK, 24E8X',
      ]),
    });
    return acc;
  },
  []
);
