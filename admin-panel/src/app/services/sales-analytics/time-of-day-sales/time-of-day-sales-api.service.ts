import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITimeOfDaySalesApiService } from './time-of-day-sales-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ITimeOfDaySale } from '../../../model/time-of-day-sale';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class TimeOfDaySalesApiService implements ITimeOfDaySalesApiService {
  private http = inject(HttpClient);

  getTimeOfDaySales(_options: QueryOptions<ITimeOfDaySale>): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'time-of-day-sales');
  }

  getTotalTimeOfDaySales(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'time-of-day-sales-number');
  }

  getTimeOfDaySaleChartData(): Observable<any> {
    return this.http.get(
      SALES_ANALYTICS_API_URL + 'time-of-day-sales-chart-data'
    );
  }
}
