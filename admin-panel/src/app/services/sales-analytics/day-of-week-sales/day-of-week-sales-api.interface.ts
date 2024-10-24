import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IDayOfWeekSale } from '../../../model/day-of-week-sale';

export interface IDayOfWeekSalesApiService {
  getDayOfWeekSales(
    options: QueryOptions<IDayOfWeekSale>
  ): Observable<Maybe<IDayOfWeekSale[]>>;
  getTotalDayOfWeekSales(): Observable<Maybe<number>>;
  getDayOfWeekSaleChartData(): Observable<Maybe<IDayOfWeekSale[]>>;
}
