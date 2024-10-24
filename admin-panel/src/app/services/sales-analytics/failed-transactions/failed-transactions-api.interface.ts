import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IFailedTransaction } from '../../../model/failed-transaction';

export interface IFailedTransactionsApiService {
  getFailedTransactions(
    options: QueryOptions<IFailedTransaction>
  ): Observable<Maybe<IFailedTransaction[]>>;
  getTotalFailedTransactions(): Observable<Maybe<number>>;
  getFailedTransactionChartData(): Observable<Maybe<IFailedTransaction[]>>;
}
