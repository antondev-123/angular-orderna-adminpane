import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ITransaction } from '../../../model/transaction';

export interface IAllTransactionsApiService {
  getTotalTransactions(): Observable<Maybe<number>>;
  getAllTransactions(
    options: QueryOptions<ITransaction>
  ): Observable<Maybe<ITransaction[]>>;
}
