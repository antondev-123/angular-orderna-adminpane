import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IProductSale } from '../../../model/product-sale';

export interface IProductSalesApiService {
  getProductSales(
    options: QueryOptions<IProductSale>
  ): Observable<Maybe<IProductSale[]>>;

  getTotalProductSales(): Observable<Maybe<number>>;
}
