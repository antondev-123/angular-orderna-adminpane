import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { ITransaction } from '../../model/transaction';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { TransactionsApiService } from '../transactions/transactions-api.service';

@Injectable()
export class TransactionsDataSource extends DataSource<ITransaction> {
  transactions$ = new BehaviorSubject<ITransaction[]>([]);
  totaltransactions$ = new BehaviorSubject<number>(0);
  totalTransactionsAfterFilter$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private transactionsSubscription: Maybe<Subscription>;
  private totalTransactionsSubscription: Maybe<Subscription>;

  constructor(private transactionsService: TransactionsApiService) {
    super();
  }

  connect(): Observable<ITransaction[]> {
    return this.transactions$.asObservable();
  }

  disconnect(): void {
    this.transactions$.complete();
    this.totaltransactions$.complete();
    this.isLoading$.complete();
    this.transactionsSubscription?.unsubscribe();
    this.totalTransactionsSubscription?.unsubscribe();
  }

  loadTotalTransactions(): void {
    this.totalTransactionsSubscription?.unsubscribe();
    this.totalTransactionsSubscription = this.transactionsService
      .getTotalTransactions()
      .subscribe((totalTransactions) => {
        console.log(totalTransactions);
        this.totaltransactions$.next(totalTransactions ?? 0);
      });
  }

  loadTransactions(options: QueryOptions<ITransaction>): void {
    this.isLoading$.next(true);
    this.transactionsSubscription?.unsubscribe();
    this.transactionsSubscription = this.transactionsService
      .getTransactions(options)
      .subscribe((response) => {
        console.log('loadTransactions', response?.data);
        this.isLoading$.next(false);
        this.transactions$.next(response?.data ?? []);
        this.totalTransactionsAfterFilter$.next(response?.count ?? 0);
      });
  }
}
