import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { IBillingInvoice } from '../../model/billing-invoice';
import { IInvoice } from '../../model/invoice';

export interface IInvoicesApiService {
  getInvoices(billingId: IBillingInvoice['id']): Observable<Maybe<IInvoice[]>>;
}
