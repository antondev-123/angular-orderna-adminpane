import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRevenuesApiService } from './revenues-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IRevenue } from '../../../model/revenue';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class RevenuesApiService implements IRevenuesApiService {
  private http = inject(HttpClient);

  getRevenues(_options: QueryOptions<IRevenue>): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'revenues');
  }

  getTotalRevenues(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'revenues-number');
  }

  getComputedRevenueSummary(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'compute-revenue-summary');
  }

  getSalesOverTime(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'sales-over-time');
  }
}
