import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ISaleDiscountSummary } from '../../model/discount-summary';
import { DiscountSummariesApiService } from '../sales-analytics/discount-summaries/discount-summaries-api.service';

@Injectable()
export class DiscountSummariesDataSource extends DataSource<ISaleDiscountSummary> {
  discountSummaries$ = new BehaviorSubject<ISaleDiscountSummary[]>([]);
  totalDiscountSummaries$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);
  discountSummaryChartData$ = new BehaviorSubject<
    Maybe<ISaleDiscountSummary[]>
  >([]);

  private discountSummariesSubscription: Maybe<Subscription>;
  private totalDiscountSummariesSubscription: Maybe<Subscription>;
  private discountSummariesChartDataSubscription: Maybe<Subscription>;

  constructor(private discountSummariesService: DiscountSummariesApiService) {
    super();
  }

  connect(): Observable<ISaleDiscountSummary[]> {
    return this.discountSummaries$.asObservable();
  }

  disconnect(): void {
    this.discountSummaries$.complete();
    this.totalDiscountSummaries$.complete();
    this.isLoading$.complete();
    this.discountSummaryChartData$.complete();
    this.discountSummariesSubscription?.unsubscribe();
    this.totalDiscountSummariesSubscription?.unsubscribe();
    this.discountSummariesChartDataSubscription?.unsubscribe();
  }

  loadTotalDiscountSummaries(): void {
    this.totalDiscountSummariesSubscription?.unsubscribe();
    this.totalDiscountSummariesSubscription = this.discountSummariesService
      .getTotalDiscountSummaries()
      .subscribe((totalDiscountSummaries) => {
        this.totalDiscountSummaries$.next(totalDiscountSummaries ?? 0);
      });
  }

  loadDiscountSummaries(options: QueryOptions<ISaleDiscountSummary>): void {
    this.isLoading$.next(true);
    this.discountSummariesSubscription?.unsubscribe();
    this.discountSummariesSubscription = this.discountSummariesService
      .getDiscountSummaries(options)
      .subscribe((discountSummaries) => {
        console.log('loadDiscountSummaries', discountSummaries);
        this.isLoading$.next(false);
        this.discountSummaries$.next(discountSummaries ?? []);
      });
  }

  loadDiscountSummaryChartData(): void {
    this.discountSummariesChartDataSubscription?.unsubscribe();
    this.discountSummariesChartDataSubscription = this.discountSummariesService
      .getDiscountSummaryChartData()
      .subscribe((dayOfWeekSaleChartData) => {
        this.discountSummaryChartData$.next(dayOfWeekSaleChartData);
      });
  }
}
