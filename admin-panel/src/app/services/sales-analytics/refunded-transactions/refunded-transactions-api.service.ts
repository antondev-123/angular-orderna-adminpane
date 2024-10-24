import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRefundedTransactionsApiService } from './refunded-transactions-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IRefundedTransaction } from '../../../model/refunded-transaction';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class RefundedTransactionsApiService
  implements IRefundedTransactionsApiService
{
  private http = inject(HttpClient);

  getRefundedTransactions(
    options: QueryOptions<IRefundedTransaction>
  ): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'refunded-transactions');
  }

  getTotalRefundedTransactions(): Observable<any> {
    return this.http.get(
      SALES_ANALYTICS_API_URL + 'refunded-transactions-number'
    );
  }
}
