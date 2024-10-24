import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ISaleDiscountSummary } from '../../../model/discount-summary';

export interface IDiscountSummariesApiService {
  getDiscountSummaries(
    options: QueryOptions<ISaleDiscountSummary>
  ): Observable<Maybe<ISaleDiscountSummary[]>>;
  getTotalDiscountSummaries(): Observable<Maybe<number>>;
  getDiscountSummaryChartData(): Observable<Maybe<ISaleDiscountSummary[]>>;
}
