import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IRefundedTransactionsApiService } from './refunded-transactions-api.interface';
import { fetchRefundedTransactions } from '../../../data/refunded-transactions';
import {
  RefundedTransaction,
  IRefundedTransaction,
} from '../../../model/refunded-transaction';

@Injectable({
  providedIn: 'root',
})
export class RefundedTransactionsMockApiService
  implements IRefundedTransactionsApiService
{
  data = {
    refunded_transactions: {
      items: [] as RefundedTransaction[],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<IRefundedTransaction>,
      subject: new BehaviorSubject<Maybe<RefundedTransaction[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get refundedTransactionsData() {
    return this.data['refunded_transactions'] as Data<
      RefundedTransaction,
      IRefundedTransaction
    >;
  }

  getRefundedTransactions(
    options: QueryOptions<IRefundedTransaction>
  ): Observable<Maybe<IRefundedTransaction[]>> {
    this.refundedTransactionsData.items = fetchRefundedTransactions(options);

    let newOptions: QueryOptions<IRefundedTransaction> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.refundedTransactionsData, newOptions);
  }

  getTotalRefundedTransactions(): Observable<Maybe<number>> {
    return getTotalItems(this.refundedTransactionsData);
  }
}
