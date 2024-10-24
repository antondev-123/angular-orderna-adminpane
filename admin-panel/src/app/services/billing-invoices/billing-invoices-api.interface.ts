import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { IUserProfile } from '../../model/user-profile';
import {
  BillingInvoice,
  BillingIntervalUpdateData,
  IBillingInvoice,
} from '../../model/billing-invoice';

export interface IBillingInvoicesApiService {
  getBillingInvoice(
    profileId: IUserProfile['id']
  ): Observable<Maybe<BillingInvoice>>;
  updateBillingInterval(
    billing: BillingIntervalUpdateData
  ): Observable<Maybe<IBillingInvoice>>;
}
