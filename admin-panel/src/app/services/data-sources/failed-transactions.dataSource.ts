import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IFailedTransaction } from '../../model/failed-transaction';
import { FailedTransactionsApiService } from '../sales-analytics/failed-transactions/failed-transactions-api.service';

@Injectable()
export class FailedTransactionsDataSource extends DataSource<IFailedTransaction> {
  failedTransactions$ = new BehaviorSubject<IFailedTransaction[]>([]);
  totalFailedTransactions$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);
  failedTransactionChartData$ = new BehaviorSubject<
    Maybe<IFailedTransaction[]>
  >([]);

  private failedTransactionsSubscription: Maybe<Subscription>;
  private totalFailedTransactionsSubscription: Maybe<Subscription>;
  private failedTransactionsChartDataSubscription: Maybe<Subscription>;

  constructor(private failedTransactionsService: FailedTransactionsApiService) {
    super();
  }

  connect(): Observable<IFailedTransaction[]> {
    return this.failedTransactions$.asObservable();
  }

  disconnect(): void {
    this.failedTransactions$.complete();
    this.totalFailedTransactions$.complete();
    this.isLoading$.complete();
    this.failedTransactionChartData$.complete();
    this.failedTransactionsSubscription?.unsubscribe();
    this.totalFailedTransactionsSubscription?.unsubscribe();
    this.failedTransactionsChartDataSubscription?.unsubscribe();
  }

  loadTotalFailedTransactions(): void {
    this.totalFailedTransactionsSubscription?.unsubscribe();
    this.totalFailedTransactionsSubscription = this.failedTransactionsService
      .getTotalFailedTransactions()
      .subscribe((totalFailedTransactions) => {
        this.totalFailedTransactions$.next(totalFailedTransactions ?? 0);
      });
  }

  loadFailedTransactions(options: QueryOptions<IFailedTransaction>): void {
    this.isLoading$.next(true);
    this.failedTransactionsSubscription?.unsubscribe();
    this.failedTransactionsSubscription = this.failedTransactionsService
      .getFailedTransactions(options)
      .subscribe((failedTransactions) => {
        console.log('loadFailedTransactions', failedTransactions);
        this.isLoading$.next(false);
        this.failedTransactions$.next(failedTransactions ?? []);
      });
  }

  loadFailedTransactionChartData(): void {
    this.failedTransactionsChartDataSubscription?.unsubscribe();
    this.failedTransactionsChartDataSubscription =
      this.failedTransactionsService
        .getFailedTransactionChartData()
        .subscribe((failedTransactionsChartData) => {
          this.failedTransactionChartData$.next(failedTransactionsChartData);
        });
  }
}
