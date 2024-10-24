import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IDiscountedTransaction } from '../../model/discounted-transaction';
import { DiscountedTransactionsApiService } from '../sales-analytics/discounted-transactions/discounted-transactions-api.service';

@Injectable()
export class DiscountedTransactionsDataSource extends DataSource<IDiscountedTransaction> {
  discountedTransactions$ = new BehaviorSubject<IDiscountedTransaction[]>([]);
  totalDiscountedTransactions$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private discountedTransactionsSubscription: Maybe<Subscription>;
  private totalDiscountedTransactionsSubscription: Maybe<Subscription>;

  constructor(
    private discountTransactionsService: DiscountedTransactionsApiService
  ) {
    super();
  }

  connect(): Observable<IDiscountedTransaction[]> {
    return this.discountedTransactions$.asObservable();
  }

  disconnect(): void {
    this.discountedTransactions$.complete();
    this.totalDiscountedTransactions$.complete();
    this.isLoading$.complete();
    this.discountedTransactionsSubscription?.unsubscribe();
    this.totalDiscountedTransactionsSubscription?.unsubscribe();
  }

  loadTotalDiscountedTransactions(): void {
    this.totalDiscountedTransactionsSubscription?.unsubscribe();
    this.totalDiscountedTransactionsSubscription =
      this.discountTransactionsService
        .getTotalDiscountedTransactions()
        .subscribe((totalDiscountedTransactions) => {
          this.totalDiscountedTransactions$.next(
            totalDiscountedTransactions ?? 0
          );
        });
  }

  loadDiscountedTransactions(
    options: QueryOptions<IDiscountedTransaction>
  ): void {
    this.isLoading$.next(true);
    this.discountedTransactionsSubscription?.unsubscribe();
    this.discountedTransactionsSubscription = this.discountTransactionsService
      .getDiscountedTransactions(options)
      .subscribe((discountedTransactions) => {
        console.log('loadDiscountedTransactions', discountedTransactions);
        this.isLoading$.next(false);
        this.discountedTransactions$.next(discountedTransactions ?? []);
      });
  }
}
