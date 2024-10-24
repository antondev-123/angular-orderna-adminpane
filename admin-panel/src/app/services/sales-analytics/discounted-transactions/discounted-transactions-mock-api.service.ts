import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IDiscountedTransactionsApiService } from './discounted-transactions-api.interface';
import { fetchDiscountedTransactions } from '../../../data/discounted-transactions';
import {
  DiscountedTransaction,
  IDiscountedTransaction,
} from '../../../model/discounted-transaction';

@Injectable({
  providedIn: 'root',
})
export class DiscountedTransactionsMockApiService
  implements IDiscountedTransactionsApiService
{
  data = {
    discounted_transactions: {
      items: [] as DiscountedTransaction[],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<IDiscountedTransaction>,
      subject: new BehaviorSubject<Maybe<DiscountedTransaction[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get discountedTransactionsData() {
    return this.data['discounted_transactions'] as Data<
      DiscountedTransaction,
      IDiscountedTransaction
    >;
  }

  getDiscountedTransactions(
    options: QueryOptions<IDiscountedTransaction>
  ): Observable<Maybe<IDiscountedTransaction[]>> {
    this.discountedTransactionsData.items =
      fetchDiscountedTransactions(options);

    let newOptions: QueryOptions<IDiscountedTransaction> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.discountedTransactionsData, newOptions);
  }

  getTotalDiscountedTransactions(): Observable<Maybe<number>> {
    return getTotalItems(this.discountedTransactionsData);
  }
}
