import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IInvoicesApiService } from './invoices-api.interface';
import { BillingInvoice } from '../../model/billing-invoice';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class InvoicesApiService implements IInvoicesApiService {
  private http = inject(HttpClient);

  getInvoices(billingId: BillingInvoice['id']): Observable<any> {
    return this.http.get(API_URL + `billing-invoices/${billingId}`);
  }
}
