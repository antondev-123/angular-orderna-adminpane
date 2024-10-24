import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ITimeOfDaySale } from '../../model/time-of-day-sale';
import { TimeOfDaySalesApiService } from '../sales-analytics/time-of-day-sales/time-of-day-sales-api.service';

@Injectable()
export class TimeOfDaySalesDataSource extends DataSource<ITimeOfDaySale> {
  timeOfDaySales$ = new BehaviorSubject<ITimeOfDaySale[]>([]);
  totalTimeOfDaySales$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);
  timeOfDaySalesChartData$ = new BehaviorSubject<Maybe<ITimeOfDaySale[]>>([]);

  private timeOfDaySalesSubscription: Maybe<Subscription>;
  private totalTimeOfDaySalesSubscription: Maybe<Subscription>;
  private timeOfDaySalesChartDataSubscription: Maybe<Subscription>;

  constructor(private timeOfDaySalesService: TimeOfDaySalesApiService) {
    super();
  }

  connect(): Observable<ITimeOfDaySale[]> {
    return this.timeOfDaySales$.asObservable();
  }

  disconnect(): void {
    this.timeOfDaySales$.complete();
    this.totalTimeOfDaySales$.complete();
    this.isLoading$.complete();
    this.timeOfDaySalesChartData$.complete();
    this.timeOfDaySalesSubscription?.unsubscribe();
    this.totalTimeOfDaySalesSubscription?.unsubscribe();
    this.timeOfDaySalesChartDataSubscription?.unsubscribe();
  }

  loadTotalTimeOfDaySales(): void {
    this.totalTimeOfDaySalesSubscription?.unsubscribe();
    this.totalTimeOfDaySalesSubscription = this.timeOfDaySalesService
      .getTotalTimeOfDaySales()
      .subscribe((totalTimeOfDaySales) => {
        this.totalTimeOfDaySales$.next(totalTimeOfDaySales ?? 0);
      });
  }

  loadTimeOfDaySales(options: QueryOptions<ITimeOfDaySale>): void {
    this.isLoading$.next(true);
    this.timeOfDaySalesSubscription?.unsubscribe();
    this.timeOfDaySalesSubscription = this.timeOfDaySalesService
      .getTimeOfDaySales(options)
      .subscribe((timeOfDaySales) => {
        console.log('loadTimeOfDaySales', timeOfDaySales);
        this.isLoading$.next(false);
        this.timeOfDaySales$.next(timeOfDaySales ?? []);
      });
  }

  loadTimeOfDaySalesChartData(): void {
    this.timeOfDaySalesChartDataSubscription?.unsubscribe();
    this.timeOfDaySalesChartDataSubscription = this.timeOfDaySalesService
      .getTimeOfDaySaleChartData()
      .subscribe((timeOfDaySaleChartData) => {
        this.timeOfDaySalesChartData$.next(timeOfDaySaleChartData);
      });
  }
}
