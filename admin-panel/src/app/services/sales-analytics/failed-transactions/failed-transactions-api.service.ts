import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFailedTransactionsApiService } from './failed-transactions-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IFailedTransaction } from '../../../model/failed-transaction';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class FailedTransactionsApiService
  implements IFailedTransactionsApiService
{
  private http = inject(HttpClient);

  getFailedTransactions(
    _options: QueryOptions<IFailedTransaction>
  ): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'failed-transactions');
  }

  getTotalFailedTransactions(): Observable<any> {
    return this.http.get(
      SALES_ANALYTICS_API_URL + 'failed-transactions-number'
    );
  }

  getFailedTransactionChartData(): Observable<any> {
    return this.http.get(
      SALES_ANALYTICS_API_URL + 'failed-transaction-chart-data'
    );
  }
}
