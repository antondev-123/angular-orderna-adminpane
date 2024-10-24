import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IZReportsApiService } from './z-reports-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IZReport } from '../../../model/z-report';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class ZReportsApiService implements IZReportsApiService {
  private http = inject(HttpClient);

  getZReports(_options: QueryOptions<IZReport>): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'z-reports');
  }

  getTotalZReports(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'z-reports-number');
  }

  getComputedZReportSummary(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'z-report-summary');
  }
}
