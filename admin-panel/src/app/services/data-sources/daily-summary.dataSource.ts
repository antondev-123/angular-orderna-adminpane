import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { IDailySummary } from '../../model/daily-summary';
import { DailySummariesApiService } from '../accounting-analytics/daily-summaries/daily-summaries-api.service';

@Injectable()
export class DailySummariesDataSource extends DataSource<IDailySummary> {
  dailySummaries$ = new BehaviorSubject<IDailySummary[]>([]);
  totalDailySummaries$ = new BehaviorSubject<number>(0);
  computedDailySummaries$ = new BehaviorSubject<Maybe<IDailySummary>>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private dailySummariesSubscription: Maybe<Subscription>;
  private totalDailySummariesSubscription: Maybe<Subscription>;
  private computedDailySummariesSubscription: Maybe<Subscription>;

  constructor(private dailySummariesService: DailySummariesApiService) {
    super();
  }

  connect(): Observable<IDailySummary[]> {
    return this.dailySummaries$.asObservable();
  }

  disconnect(): void {
    this.dailySummaries$.complete();
    this.totalDailySummaries$.complete();
    this.isLoading$.complete();
    this.computedDailySummaries$.complete();
    this.dailySummariesSubscription?.unsubscribe();
    this.totalDailySummariesSubscription?.unsubscribe();
    this.computedDailySummariesSubscription?.unsubscribe();
    this.isLoading$?.unsubscribe();
    this.computedDailySummaries$?.unsubscribe();
  }

  loadTotalDailySummaries(): void {
    this.totalDailySummariesSubscription?.unsubscribe();
    this.totalDailySummariesSubscription = this.dailySummariesService
      .getTotalDailySummaries()
      .subscribe((totalDailySummaries) => {
        this.totalDailySummaries$.next(totalDailySummaries ?? 0);
      });
  }

  loadComputedDailySummaries(): void {
    this.computedDailySummariesSubscription?.unsubscribe();
    this.computedDailySummariesSubscription = this.dailySummariesService
      .getComputedDailySummaries()
      .subscribe((computedDailySummaries) => {
        this.computedDailySummaries$.next(computedDailySummaries ?? null);
      });
  }

  loadDailySummaries(options: QueryOptions<IDailySummary>): void {
    this.isLoading$.next(true);
    this.dailySummariesSubscription?.unsubscribe();
    this.dailySummariesSubscription = this.dailySummariesService
      .getDailySummaries(options)
      .subscribe((DailySummaries) => {
        console.log('loadDailySummaries', DailySummaries);
        this.isLoading$.next(false);
        this.dailySummaries$.next(DailySummaries ?? []);
      });
  }
}
