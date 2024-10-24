import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ITipsByDay } from '../../../model/tips-by-day';

export interface ITipsByDaysApiService {
  getTipsByDays(
    options: QueryOptions<ITipsByDay>
  ): Observable<Maybe<ITipsByDay[]>>;

  getTotalTipsByDays(): Observable<Maybe<number>>;

  getComputedTipsByDaySummary(): Observable<Maybe<ITipsByDay>>;

  getTipsByDayChartData(): Observable<Maybe<ITipsByDay[]>>;
}
