import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IRevenue } from '../../../model/revenue';

export interface IRevenuesApiService {
  getRevenues(options: QueryOptions<IRevenue>): Observable<Maybe<IRevenue[]>>;
  getTotalRevenues(): Observable<Maybe<number>>;
  getComputedRevenueSummary(): Observable<Maybe<IRevenue>>;
  getSalesOverTime(): Observable<Maybe<IRevenue[]>>;
}
