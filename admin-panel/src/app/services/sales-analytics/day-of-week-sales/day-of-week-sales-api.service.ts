import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDayOfWeekSalesApiService } from './day-of-week-sales-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IDayOfWeekSale } from '../../../model/day-of-week-sale';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class DayOfWeekSalesApiService implements IDayOfWeekSalesApiService {
  private http = inject(HttpClient);

  getDayOfWeekSales(_options: QueryOptions<IDayOfWeekSale>): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'day-of-week-sales');
  }

  getTotalDayOfWeekSales(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'day-of-week-sales-number');
  }

  getDayOfWeekSaleChartData(): Observable<any> {
    return this.http.get(
      SALES_ANALYTICS_API_URL + 'day-of-week-sales-chart-data'
    );
  }
}
