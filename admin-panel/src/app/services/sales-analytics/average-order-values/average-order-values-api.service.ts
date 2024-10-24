import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAverageOrderValuesApiService } from './average-order-values-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IAverageOrderValue } from '../../../model/average-order-value';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class AverageOrderValuesApiService
  implements IAverageOrderValuesApiService
{
  private http = inject(HttpClient);

  getAverageOrderValues(
    _options: QueryOptions<IAverageOrderValue>
  ): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'average-order-values');
  }

  getTotalAverageOrderValues(): Observable<any> {
    return this.http.get(
      SALES_ANALYTICS_API_URL + 'average-order-values-number'
    );
  }

  getComputedAverageOrderValueSummary(): Observable<any> {
    return this.http.get(
      SALES_ANALYTICS_API_URL + 'average-order-value-summary'
    );
  }

  getAverageOrderValueChartData(): Observable<any> {
    return this.http.get(
      SALES_ANALYTICS_API_URL + 'average-order-value-chart-data'
    );
  }
}
