import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { IFailedTransactionsApiService } from './failed-transactions-api.interface';
import { fetchFailedTransactions } from '../../../data/failed-transactions';
import {
  FailedTransaction,
  IFailedTransaction,
} from '../../../model/failed-transaction';

@Injectable({
  providedIn: 'root',
})
export class FailedTransactionsMockApiService
  implements IFailedTransactionsApiService
{
  data = {
    failed_transactions: {
      items: [] as FailedTransaction[],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<IFailedTransaction>,
      subject: new BehaviorSubject<Maybe<FailedTransaction[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get failedTransactionsData() {
    return this.data['failed_transactions'] as Data<
      FailedTransaction,
      IFailedTransaction
    >;
  }

  getFailedTransactions(
    options: QueryOptions<IFailedTransaction>
  ): Observable<Maybe<IFailedTransaction[]>> {
    this.failedTransactionsData.items = fetchFailedTransactions(options);

    let newOptions: QueryOptions<IFailedTransaction> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.failedTransactionsData, newOptions);
  }

  getTotalFailedTransactions(): Observable<Maybe<number>> {
    return getTotalItems(this.failedTransactionsData);
  }

  getFailedTransactionChartData(): Observable<Maybe<IFailedTransaction[]>> {
    return of(this.failedTransactionsData.items).pipe(delay(1000));
  }
}
