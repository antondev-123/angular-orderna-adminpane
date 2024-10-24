import { Injectable } from '@angular/core';
import { IDayOfWeekSale } from '../../model/day-of-week-sale';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { DayOfWeekSalesApiService } from '../sales-analytics/day-of-week-sales/day-of-week-sales-api.service';

@Injectable()
export class DayOfWeekSalesDataSource extends DataSource<IDayOfWeekSale> {
  dayOfWeekSales$ = new BehaviorSubject<IDayOfWeekSale[]>([]);
  totalDayOfWeekSales$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);
  dayOfWeekSalesChartData$ = new BehaviorSubject<Maybe<IDayOfWeekSale[]>>([]);

  private dayOfWeekSalesSubscription: Maybe<Subscription>;
  private totalDayOfWeekSalesSubscription: Maybe<Subscription>;
  private dayOfWeekSalesChartDataSubscription: Maybe<Subscription>;

  constructor(private dayOfWeekSalesService: DayOfWeekSalesApiService) {
    super();
  }

  connect(): Observable<IDayOfWeekSale[]> {
    return this.dayOfWeekSales$.asObservable();
  }

  disconnect(): void {
    this.dayOfWeekSales$.complete();
    this.totalDayOfWeekSales$.complete();
    this.isLoading$.complete();
    this.dayOfWeekSalesChartData$.complete();
    this.dayOfWeekSalesSubscription?.unsubscribe();
    this.totalDayOfWeekSalesSubscription?.unsubscribe();
    this.dayOfWeekSalesChartDataSubscription?.unsubscribe();
  }

  loadTotalDayOfWeekSales(): void {
    this.totalDayOfWeekSalesSubscription?.unsubscribe();
    this.totalDayOfWeekSalesSubscription = this.dayOfWeekSalesService
      .getTotalDayOfWeekSales()
      .subscribe((totalDayOfWeekSales) => {
        this.totalDayOfWeekSales$.next(totalDayOfWeekSales ?? 0);
      });
  }

  loadDayOfWeekSales(options: QueryOptions<IDayOfWeekSale>): void {
    this.isLoading$.next(true);
    this.dayOfWeekSalesSubscription?.unsubscribe();
    this.dayOfWeekSalesSubscription = this.dayOfWeekSalesService
      .getDayOfWeekSales(options)
      .subscribe((dayOfWeekSales) => {
        console.log('loadDayOfWeekSales', dayOfWeekSales);
        this.isLoading$.next(false);
        this.dayOfWeekSales$.next(dayOfWeekSales ?? []);
      });
  }

  loadDayOfWeekSalesChartData(): void {
    this.dayOfWeekSalesChartDataSubscription?.unsubscribe();
    this.dayOfWeekSalesChartDataSubscription = this.dayOfWeekSalesService
      .getDayOfWeekSaleChartData()
      .subscribe((dayOfWeekSaleChartData) => {
        this.dayOfWeekSalesChartData$.next(dayOfWeekSaleChartData);
      });
  }
}
