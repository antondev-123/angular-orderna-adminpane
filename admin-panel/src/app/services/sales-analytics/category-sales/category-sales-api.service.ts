import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategorySalesApiService } from './category-sales-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ICategorySale } from '../../../model/category-sale';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class CategorySalesApiService implements ICategorySalesApiService {
  private http = inject(HttpClient);

  getCategorySales(_options: QueryOptions<ICategorySale>): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'category-sales');
  }

  getTotalCategorySales(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'category-sales-number');
  }
}
