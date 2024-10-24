import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDailySummariesApiService } from './daily-summaries-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IDailySummary } from '../../../model/daily-summary';
import { ACCOUNTING_ANALYTICS_API_URL } from '../accounting-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class DailySummariesApiService implements IDailySummariesApiService {
  private http = inject(HttpClient);

  getDailySummaries(_options: QueryOptions<IDailySummary>): Observable<any> {
    return this.http.get(ACCOUNTING_ANALYTICS_API_URL + 'daily-summaries');
  }

  getTotalDailySummaries(): Observable<any> {
    return this.http.get(ACCOUNTING_ANALYTICS_API_URL + 'daily-summary-number');
  }

  getComputedDailySummaries(): Observable<any> {
    return this.http.get(
      ACCOUNTING_ANALYTICS_API_URL + 'compute-total-daily-summary'
    );
  }
}
