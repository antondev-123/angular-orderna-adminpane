import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../../model/user-profile';
import { IBillingInvoicesApiService } from './billing-invoices-api.interface';
import { BillingIntervalUpdateData } from '../../model/billing-invoice';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class BillingInvoicesApiService implements IBillingInvoicesApiService {
  private http = inject(HttpClient);

  getBillingInvoice(profileId: UserProfile['id']): Observable<any> {
    return this.http.get(API_URL + `billing-invoices/${profileId}`);
  }
  updateBillingInterval(billing: BillingIntervalUpdateData): Observable<any> {
    return this.http.put(
      API_URL + 'subscription-plan-update',
      JSON.stringify(billing)
    );
  }
}
