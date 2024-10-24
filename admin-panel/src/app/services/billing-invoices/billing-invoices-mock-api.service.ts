import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  getItem,
  updateItem,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserProfile } from '../../model/user-profile';
import { IBillingInvoicesApiService } from './billing-invoices-api.interface';
import { BILLING_INVOICES } from '../../data/billing-invoices';
import {
  IBillingInvoice,
  BillingInvoice,
  BillingIntervalUpdateData,
} from '../../model/billing-invoice';

@Injectable({
  providedIn: 'root',
})
export class BillingInvoicesMockApiService
  implements IBillingInvoicesApiService
{
  data = {
    billing_invoices: {
      items: [...BILLING_INVOICES],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IBillingInvoice>,
      subject: new BehaviorSubject<Maybe<BillingInvoice[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get billingInvoicesData() {
    return this.data['billing_invoices'] as Data<
      BillingInvoice,
      IBillingInvoice
    >;
  }

  getBillingInvoice(
    profileId: IUserProfile['id']
  ): Observable<Maybe<BillingInvoice>> {
    return getItem(this.billingInvoicesData, profileId);
  }
  updateBillingInterval(billing: BillingIntervalUpdateData): Observable<any> {
    return updateItem(this.billingInvoicesData, billing);
  }
}
