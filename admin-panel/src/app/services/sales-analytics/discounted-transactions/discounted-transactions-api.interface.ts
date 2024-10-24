import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IDiscountedTransaction } from '../../../model/discounted-transaction';

export interface IDiscountedTransactionsApiService {
  getDiscountedTransactions(
    options: QueryOptions<IDiscountedTransaction>
  ): Observable<Maybe<IDiscountedTransaction[]>>;

  getTotalDiscountedTransactions(): Observable<Maybe<number>>;
}
