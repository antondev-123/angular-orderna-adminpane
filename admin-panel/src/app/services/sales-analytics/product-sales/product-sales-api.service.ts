import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProductSalesApiService } from './product-sales-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IProductSale } from '../../../model/product-sale';
import { SALES_ANALYTICS_API_URL } from '../sales-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class ProductSalesApiService implements IProductSalesApiService {
  private http = inject(HttpClient);

  getProductSales(_options: QueryOptions<IProductSale>): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'product-sales');
  }

  getTotalProductSales(): Observable<any> {
    return this.http.get(SALES_ANALYTICS_API_URL + 'product-sales-number');
  }
}
