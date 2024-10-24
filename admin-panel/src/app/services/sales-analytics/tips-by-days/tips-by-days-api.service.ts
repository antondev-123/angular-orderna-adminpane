import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITipsByDaysApiService } from './tips-by-days-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ITipsByDay } from '../../../model/tips-by-day';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class TipsByDaysApiService implements ITipsByDaysApiService {
  private http = inject(HttpClient);

  getTipsByDays(_options: QueryOptions<ITipsByDay>): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'tips-by-days');
  }

  getTotalTipsByDays(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'tips-by-days-number');
  }

  getComputedTipsByDaySummary(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'tips-by-day-summary');
  }

  getTipsByDayChartData(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'tips-by-day-chart-data');
  }
}
