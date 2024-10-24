import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IRefundedTransaction } from '../../model/refunded-transaction';
import { RefundedTransactionsApiService } from '../sales-analytics/refunded-transactions/refunded-transactions-api.service';

@Injectable()
export class RefundedTransactionsDataSource extends DataSource<IRefundedTransaction> {
  refundedTransactions$ = new BehaviorSubject<IRefundedTransaction[]>([]);
  totalRefundedTransactions$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private refundedTransactionsSubscription: Maybe<Subscription>;
  private totalRefundedTransactionsSubscription: Maybe<Subscription>;

  constructor(
    private refundedTransactionsService: RefundedTransactionsApiService
  ) {
    super();
  }

  connect(): Observable<IRefundedTransaction[]> {
    return this.refundedTransactions$.asObservable();
  }

  disconnect(): void {
    this.refundedTransactions$.complete();
    this.totalRefundedTransactions$.complete();
    this.isLoading$.complete();
    this.refundedTransactionsSubscription?.unsubscribe();
    this.totalRefundedTransactionsSubscription?.unsubscribe();
  }

  loadTotalRefundedTransactions(): void {
    this.totalRefundedTransactionsSubscription?.unsubscribe();
    this.totalRefundedTransactionsSubscription =
      this.refundedTransactionsService
        .getTotalRefundedTransactions()
        .subscribe((totalRefundedTransactions) => {
          this.totalRefundedTransactions$.next(totalRefundedTransactions ?? 0);
        });
  }

  loadRefundedTransactions(options: QueryOptions<IRefundedTransaction>): void {
    this.isLoading$.next(true);
    this.refundedTransactionsSubscription?.unsubscribe();
    this.refundedTransactionsSubscription = this.refundedTransactionsService
      .getRefundedTransactions(options)
      .subscribe((refundedTransactions) => {
        console.log('loadRefundedTransactions', refundedTransactions);
        this.isLoading$.next(false);
        this.refundedTransactions$.next(refundedTransactions ?? []);
      });
  }
}
