import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ITimeOfDaySale } from '../../../model/time-of-day-sale';

export interface ITimeOfDaySalesApiService {
  getTimeOfDaySales(
    options: QueryOptions<ITimeOfDaySale>
  ): Observable<Maybe<ITimeOfDaySale[]>>;
  getTotalTimeOfDaySales(): Observable<Maybe<number>>;
  getTimeOfDaySaleChartData(): Observable<Maybe<ITimeOfDaySale[]>>;
}
