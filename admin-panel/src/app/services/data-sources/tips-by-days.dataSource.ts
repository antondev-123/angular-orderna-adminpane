import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ITipsByDay } from '../../model/tips-by-day';
import { TipsByDaysApiService } from '../sales-analytics/tips-by-days/tips-by-days-api.service';

@Injectable()
export class TipsByDaysDataSource extends DataSource<ITipsByDay> {
  tipsByDays$ = new BehaviorSubject<ITipsByDay[]>([]);
  totalTipsByDays$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);
  tipsByDaySummary$ = new BehaviorSubject<Maybe<ITipsByDay>>(null);
  tipsByDayChartData$ = new BehaviorSubject<Maybe<ITipsByDay[]>>([]);

  private tipsByDaysSubscription: Maybe<Subscription>;
  private totalTipsByDaysSubscription: Maybe<Subscription>;
  private tipsByDaySummarySubscription: Maybe<Subscription>;
  private tipsByDayChartDataSubscription: Maybe<Subscription>;

  constructor(private tipsByDaysService: TipsByDaysApiService) {
    super();
  }

  connect(): Observable<ITipsByDay[]> {
    return this.tipsByDays$.asObservable();
  }

  disconnect(): void {
    this.tipsByDays$.complete();
    this.totalTipsByDays$.complete();
    this.isLoading$.complete();
    this.tipsByDaySummary$.complete();
    this.tipsByDayChartData$.complete();
    this.tipsByDaysSubscription?.unsubscribe();
    this.totalTipsByDaysSubscription?.unsubscribe();
    this.tipsByDaySummarySubscription?.unsubscribe();
    this.tipsByDayChartDataSubscription?.unsubscribe();
  }

  loadTotalTipsByDays(): void {
    this.totalTipsByDaysSubscription?.unsubscribe();
    this.totalTipsByDaysSubscription = this.tipsByDaysService
      .getTotalTipsByDays()
      .subscribe((totalTipsByDays) => {
        this.totalTipsByDays$.next(totalTipsByDays ?? 0);
      });
  }

  loadTipsByDays(options: QueryOptions<ITipsByDay>): void {
    this.isLoading$.next(true);
    this.tipsByDaysSubscription?.unsubscribe();
    this.tipsByDaysSubscription = this.tipsByDaysService
      .getTipsByDays(options)
      .subscribe((tipsByDays) => {
        console.log('loadTipsByDays', tipsByDays);
        this.isLoading$.next(false);
        this.tipsByDays$.next(tipsByDays ?? []);
      });
  }

  loadTipsByDaySummary(): void {
    this.tipsByDaySummarySubscription?.unsubscribe();
    this.tipsByDaySummarySubscription = this.tipsByDaysService
      .getComputedTipsByDaySummary()
      .subscribe((tipsByDaySummary) => {
        this.tipsByDaySummary$.next(tipsByDaySummary);
      });
  }

  loadTipsByDayChartData(): void {
    this.tipsByDayChartDataSubscription?.unsubscribe();
    this.tipsByDayChartDataSubscription = this.tipsByDaysService
      .getTipsByDayChartData()
      .subscribe((tipsByDayChartData) => {
        this.tipsByDayChartData$.next(tipsByDayChartData);
      });
  }
}
