import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ITransaction } from '../../model/transaction';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { AllTransactionsApiService } from '../accounting-analytics/all-transactions/all-transactions-api.service';

@Injectable()
export class AllTransactionsDataSource extends DataSource<ITransaction> {
  allTransactions$ = new BehaviorSubject<ITransaction[]>([]);
  totalAllTransactions$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private allTransactionsSubscription: Maybe<Subscription>;
  private totalAllTransactionsSubscription: Maybe<Subscription>;

  constructor(private allTransactionsService: AllTransactionsApiService) {
    super();
  }

  connect(): Observable<ITransaction[]> {
    return this.allTransactions$.asObservable();
  }

  disconnect(): void {
    this.allTransactions$.complete();
    this.totalAllTransactions$.complete();
    this.isLoading$.complete();
    this.allTransactionsSubscription?.unsubscribe();
    this.totalAllTransactionsSubscription?.unsubscribe();
  }

  loadTotalAllTransactions(): void {
    this.totalAllTransactionsSubscription?.unsubscribe();
    this.totalAllTransactionsSubscription = this.allTransactionsService
      .getTotalTransactions()
      .subscribe((totalAllTransactions) => {
        this.totalAllTransactions$.next(totalAllTransactions ?? 0);
      });
  }

  loadTransactions(options: QueryOptions<ITransaction>): void {
    this.isLoading$.next(true);
    this.allTransactionsSubscription?.unsubscribe();
    this.allTransactionsSubscription = this.allTransactionsService
      .getAllTransactions(options)
      .subscribe((transactions) => {
        console.log('loadalltransactions', transactions);
        this.isLoading$.next(false);
        this.allTransactions$.next(transactions ?? []);
      });
  }
}
