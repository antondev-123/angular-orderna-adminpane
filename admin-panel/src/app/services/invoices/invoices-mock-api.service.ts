import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Data, filterItems } from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IInvoicesApiService } from './invoices-api.interface';
import { IBillingInvoice } from '../../model/billing-invoice';
import { INVOICES } from '../../data/invoices';
import { IInvoice, Invoice } from '../../model/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoicesMockApiService implements IInvoicesApiService {
  data = {
    invoices: {
      items: [...INVOICES],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IInvoice>,
      subject: new BehaviorSubject<Maybe<Invoice[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get invoicesData() {
    return this.data['invoices'] as Data<Invoice, IInvoice>;
  }

  getInvoices(billingId: IBillingInvoice['id']): Observable<Maybe<IInvoice[]>> {
    const andFilterByUser = (item: IInvoice) => {
      return INVOICES.some(
        (t) =>
          t.billingInvoice.profile.user.id ===
            item.billingInvoice.profile.user.id &&
          t.billingInvoice.profile.user.id === +billingId
      );
    };

    return filterItems(this.invoicesData, undefined, andFilterByUser);
  }
}
