import { inject, Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { filterItems } from '@orderna/admin-panel/src/utils/service';
import { IAllTransactionsApiService } from './all-transactions-api.interface';
import { TRANSACTIONS } from '../../../data/transactions';
import { ITransaction, Transaction } from '../../../model/transaction';
import { TransactionsApiService } from '../../transactions/transactions-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AllTransactionsMockApiService
  implements IAllTransactionsApiService
{
  private transactionsService = inject(TransactionsApiService);

  getTotalTransactions(): Observable<Maybe<number>> {
    return this.transactionsService.getTotalTransactions();
  }

  getAllTransactions(
    options: QueryOptions<ITransaction>
  ): Observable<Maybe<Transaction[]>> {
    const andFilterByStoreAndStatus = (item: ITransaction) => {
      let result = true;
      if (options.filters?.find((f) => f.field === 'store')) {
        const storeFilter = options.filters?.find((f) => f.field === 'store');

        result = TRANSACTIONS.some(
          (t) =>
            item.id === t.id &&
            !!storeFilter &&
            storeFilter?.value.includes(`${t.store.id}`)
        );
      }

      return result;
    };

    return filterItems(
      this.transactionsService.transactionsData,
      options,
      andFilterByStoreAndStatus
    );
  }
}
