import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IDiscountSummary } from '../../model/discount';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { DiscountsApiService } from '../discounts/discounts-api.service';

@Injectable()
export class DiscountsDataSource extends DataSource<IDiscountSummary> {
  discounts$ = new BehaviorSubject<IDiscountSummary[]>([]);
  totalDiscounts$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private discountsSubscription: Maybe<Subscription>;
  private totalDiscountsSubscription: Maybe<Subscription>;

  constructor(private discountsService: DiscountsApiService) {
    super();
  }

  connect(): Observable<IDiscountSummary[]> {
    return this.discounts$.asObservable();
  }

  disconnect(): void {
    this.discounts$.complete();
    this.totalDiscounts$.complete();
    this.isLoading$.complete();
    this.discountsSubscription?.unsubscribe();
    this.totalDiscountsSubscription?.unsubscribe();
  }

  loadTotalDiscounts(): void {
    this.totalDiscountsSubscription?.unsubscribe();
    this.totalDiscountsSubscription = this.discountsService
      .getTotalDiscounts()
      .subscribe((totalDiscounts) => {
        this.totalDiscounts$.next(totalDiscounts ?? 0);
      });
  }

  loadDiscounts(options: QueryOptions<IDiscountSummary>): void {
    this.isLoading$.next(true);
    this.discountsSubscription?.unsubscribe();
    this.discountsSubscription = this.discountsService
      .getDiscounts(options)
      .subscribe((discounts) => {
        console.log('loadDiscounts', discounts);
        this.isLoading$.next(false);
        this.discounts$.next(discounts ?? []);
      });
  }
}
