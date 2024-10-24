import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDiscountedTransactionsApiService } from './discounted-transactions-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IDiscountedTransaction } from '../../../model/discounted-transaction';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class DiscountedTransactionsApiService
  implements IDiscountedTransactionsApiService
{
  private http = inject(HttpClient);

  getDiscountedTransactions(
    _options: QueryOptions<IDiscountedTransaction>
  ): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'discounted-transactions');
  }

  getTotalDiscountedTransactions(): Observable<any> {
    return this.http.get(
      SALES_ANALYTICS_API_URL + 'discounted-transactions-number'
    );
  }
}
