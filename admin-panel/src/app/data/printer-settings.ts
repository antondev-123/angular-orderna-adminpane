import { getRandomBoolean } from '../../utils/dummy-data';
import { PrinterSetting } from '../model/printer-settings';
import { USER_PROFILES } from './user-profiles';

export const PRINTER_SETTINGS = USER_PROFILES.reduce(
  (acc: PrinterSetting[], profile) => {
    acc.push({
      id: profile.id,
      profile,
      printerNote:
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
      showTaxDiscountShipping: getRandomBoolean(),
      printInvoiceAutomatically: getRandomBoolean(),
      showCustomerAddress: getRandomBoolean(),
      showCustomerName: getRandomBoolean(),
      showEmailAddress: getRandomBoolean(),
      showNoteToCustomer: getRandomBoolean(),
      showPhoneNumber: getRandomBoolean(),
      showStore: getRandomBoolean(),
    });
    return acc;
  },
  []
);
