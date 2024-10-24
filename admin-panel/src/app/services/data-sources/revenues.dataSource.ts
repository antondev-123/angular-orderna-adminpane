import { DataSource } from '@angular/cdk/collections';
import { IRevenue } from '../../model/revenue';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { RevenuesApiService } from '../sales-analytics/revenues/revenues-api.service';

@Injectable()
export class RevenuesDataSource extends DataSource<IRevenue> {
  revenues$ = new BehaviorSubject<IRevenue[]>([]);
  salesOverTime$ = new BehaviorSubject<IRevenue[]>([]);
  totalRevenues$ = new BehaviorSubject<number>(0);
  revenueSummary$ = new BehaviorSubject<Maybe<IRevenue>>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private revenuesSubscription: Maybe<Subscription>;
  private totalRevenuesSubscription: Maybe<Subscription>;
  private salesOverTimeSubscription: Maybe<Subscription>;
  private revenueSummarySubscription: Maybe<Subscription>;

  constructor(private revenuesService: RevenuesApiService) {
    super();
  }

  connect(): Observable<IRevenue[]> {
    return this.revenues$.asObservable();
  }

  disconnect(): void {
    this.revenues$.complete();
    this.totalRevenues$.complete();
    this.isLoading$.complete();
    this.salesOverTime$.complete();
    this.revenueSummary$.complete();
    this.revenuesSubscription?.unsubscribe();
    this.totalRevenuesSubscription?.unsubscribe();
    this.salesOverTimeSubscription?.unsubscribe();
    this.revenueSummarySubscription?.unsubscribe();
  }

  loadRevenueSummary(): void {
    this.revenueSummarySubscription?.unsubscribe();
    this.revenueSummarySubscription = this.revenuesService
      .getComputedRevenueSummary()
      .subscribe((revenueSummary) => {
        this.revenueSummary$.next(revenueSummary ?? null);
      });
  }

  loadTotalRevenues(): void {
    this.totalRevenuesSubscription?.unsubscribe();
    this.totalRevenuesSubscription = this.revenuesService
      .getTotalRevenues()
      .subscribe((totalRevenues) => {
        this.totalRevenues$.next(totalRevenues ?? 0);
      });
  }

  loadRevenues(options: QueryOptions<IRevenue>): void {
    this.isLoading$.next(true);
    this.revenuesSubscription?.unsubscribe();
    this.revenuesSubscription = this.revenuesService
      .getRevenues(options)
      .subscribe((transactions) => {
        console.log('loadallrevenues', transactions);
        this.isLoading$.next(false);
        this.revenues$.next(transactions ?? []);
      });
  }

  loadSalesOverTime(): void {
    this.salesOverTimeSubscription?.unsubscribe();
    this.salesOverTimeSubscription = this.revenuesService
      .getSalesOverTime()
      .subscribe((salesOverTime) => {
        this.salesOverTime$.next(salesOverTime ?? []);
      });
  }
}
