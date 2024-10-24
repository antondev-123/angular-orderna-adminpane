import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IAverageOrderValue } from '../../../model/average-order-value';

export interface IAverageOrderValuesApiService {
  getAverageOrderValues(
    options: QueryOptions<IAverageOrderValue>
  ): Observable<Maybe<IAverageOrderValue[]>>;
  getTotalAverageOrderValues(): Observable<Maybe<number>>;
  getComputedAverageOrderValueSummary(): Observable<Maybe<IAverageOrderValue>>;
  getAverageOrderValueChartData(): Observable<Maybe<IAverageOrderValue[]>>;
}
