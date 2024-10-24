import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ISalesApiService } from './sales-api.interface';
import { IDashboardFilter } from '../../features/dashboard/dashboard-header/dashboard-header.component';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class SalesApiService implements ISalesApiService {
  private http = inject(HttpClient);

  getTopSales(filter: IDashboardFilter): Observable<any> {
    return this.http.get(API_URL + 'top-sales/' + filter.storeId);
  }

  getTotalSales(filter: IDashboardFilter): Observable<any> {
    return this.http.get(API_URL + 'total-sales');
  }
}
