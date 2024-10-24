import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Observable } from 'rxjs';
import { IDailySummary } from '../../../model/daily-summary';

export interface IDailySummariesApiService {
  getDailySummaries(
    options: QueryOptions<IDailySummary>
  ): Observable<Maybe<IDailySummary[]>>;
  getTotalDailySummaries(): Observable<Maybe<number>>;
  getComputedDailySummaries(): Observable<Maybe<IDailySummary>>;
}
