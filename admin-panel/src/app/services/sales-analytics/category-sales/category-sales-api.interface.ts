import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ICategorySale } from '../../../model/category-sale';

export interface ICategorySalesApiService {
  getCategorySales(
    options: QueryOptions<ICategorySale>
  ): Observable<Maybe<ICategorySale[]>>;

  getTotalCategorySales(): Observable<Maybe<number>>;
}
