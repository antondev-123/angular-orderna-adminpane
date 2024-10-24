import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDiscountSummariesApiService } from './discount-summaries-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ISaleDiscountSummary } from '../../../model/discount-summary';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class DiscountSummariesApiService
  implements IDiscountSummariesApiService
{
  private http = inject(HttpClient);

  getDiscountSummaries(
    _options: QueryOptions<ISaleDiscountSummary>
  ): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'discount-summaries');
  }

  getTotalDiscountSummaries(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'discount-summaries-number');
  }

  getDiscountSummaryChartData(): Observable<any> {
    return this.http.get(
      SALES_ANALYTICS_API_URL + 'discount-summary-chart-data'
    );
  }
}
