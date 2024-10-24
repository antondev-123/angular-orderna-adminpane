import { FormControl } from '@angular/forms';
import { CurrencyCode } from '../../../model/enum/currency-code';
import { Mobile } from '../../../shared/components/input/contact/mobile/mobile.interface';
import { Telephone } from '../../../shared/components/input/contact/telephone/telephone.interface';

export interface StoreDetailsControl {
  name: FormControl<string>;
  about: FormControl<string>;
  currency: FormControl<CurrencyCode>;
  VATNumber: FormControl<string>;
}

export interface StoreAddressControl {
  streetAddress: FormControl<string>;
  buildingNumber: FormControl<string>;
  city: FormControl<string>;
  zipCode: FormControl<string>;
}

export interface StoreContactInformationControl {
  email: FormControl<string>;
  mobile: FormControl<Mobile>;
  telephone: FormControl<Telephone>;
  website: FormControl<string>;
}
