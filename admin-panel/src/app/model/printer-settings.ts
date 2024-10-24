import { UserProfile } from './user-profile';

export interface IPrinterSetting {
  id: number;
  profile: UserProfile;
  printerNote: string;
  showPhoneNumber: boolean;
  showCustomerName: boolean;
  showNoteToCustomer: boolean;
  showCustomerAddress: boolean;
  showStore: boolean;
  printInvoiceAutomatically: boolean;
  showEmailAddress: boolean;
  showTaxDiscountShipping: boolean;
}

export type PrinterSettingUpdateData = Omit<IPrinterSetting, 'profile'>;

export class PrinterSetting implements IPrinterSetting {
  id: number;
  profile: UserProfile;
  printerNote: string;
  showPhoneNumber: boolean;
  showCustomerName: boolean;
  showNoteToCustomer: boolean;
  showCustomerAddress: boolean;
  showStore: boolean;
  printInvoiceAutomatically: boolean;
  showEmailAddress: boolean;
  showTaxDiscountShipping: boolean;

  constructor({
    id = 0,
    profile = new UserProfile({}),
    printerNote = '',
    showPhoneNumber = true,
    showCustomerName = true,
    showNoteToCustomer = true,
    showCustomerAddress = true,
    showStore = true,
    printInvoiceAutomatically = true,
    showEmailAddress = true,
    showTaxDiscountShipping = true,
  }: Partial<PrinterSetting>) {
    this.id = id;
    this.profile = profile;
    this.printerNote = printerNote;
    this.showPhoneNumber = showPhoneNumber;
    this.showCustomerName = showCustomerName;
    this.showNoteToCustomer = showNoteToCustomer;
    this.showCustomerAddress = showCustomerAddress;
    this.showStore = showStore;
    this.printInvoiceAutomatically = printInvoiceAutomatically;
    this.showEmailAddress = showEmailAddress;
    this.showTaxDiscountShipping = showTaxDiscountShipping;
  }
}
