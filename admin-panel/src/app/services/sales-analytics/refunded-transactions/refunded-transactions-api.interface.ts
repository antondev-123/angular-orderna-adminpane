import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IRefundedTransaction } from '../../../model/refunded-transaction';

export interface IRefundedTransactionsApiService {
  getRefundedTransactions(
    options: QueryOptions<IRefundedTransaction>
  ): Observable<Maybe<IRefundedTransaction[]>>;
  getTotalRefundedTransactions(): Observable<Maybe<number>>;
}
