import { Injectable } from '@angular/core';
import { IAverageOrderValue } from '../../model/average-order-value';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { AverageOrderValuesApiService } from '../sales-analytics/average-order-values/average-order-values-api.service';

@Injectable()
export class AverageOrderValuesDataSource extends DataSource<IAverageOrderValue> {
  averageOrderValues$ = new BehaviorSubject<IAverageOrderValue[]>([]);
  totalAverageOrderValues$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);
  averageOrderValueSummary$ = new BehaviorSubject<Maybe<IAverageOrderValue>>(
    null
  );
  averageOrderValueChartData$ = new BehaviorSubject<
    Maybe<IAverageOrderValue[]>
  >([]);

  private averageOrderValuesSubscription: Maybe<Subscription>;
  private totalAverageOrderValuesSubscription: Maybe<Subscription>;
  private averageOrderValueSummarySubscription: Maybe<Subscription>;
  private averageOrderValueChartDataSubscription: Maybe<Subscription>;

  constructor(private averageOrderValuesService: AverageOrderValuesApiService) {
    super();
  }

  connect(): Observable<IAverageOrderValue[]> {
    return this.averageOrderValues$.asObservable();
  }

  disconnect(): void {
    this.averageOrderValues$.complete();
    this.totalAverageOrderValues$.complete();
    this.isLoading$.complete();
    this.averageOrderValueSummary$.complete();
    this.averageOrderValueChartData$.complete();
    this.averageOrderValuesSubscription?.unsubscribe();
    this.totalAverageOrderValuesSubscription?.unsubscribe();
    this.averageOrderValueSummarySubscription?.unsubscribe();
    this.averageOrderValueChartDataSubscription?.unsubscribe();
  }

  loadTotalAverageOrderValues(): void {
    this.totalAverageOrderValuesSubscription?.unsubscribe();
    this.totalAverageOrderValuesSubscription = this.averageOrderValuesService
      .getTotalAverageOrderValues()
      .subscribe((totalAverageOrderValues) => {
        this.totalAverageOrderValues$.next(totalAverageOrderValues ?? 0);
      });
  }

  loadAverageOrderValues(options: QueryOptions<IAverageOrderValue>): void {
    this.isLoading$.next(true);
    this.averageOrderValuesSubscription?.unsubscribe();
    this.averageOrderValuesSubscription = this.averageOrderValuesService
      .getAverageOrderValues(options)
      .subscribe((averageOrderValues) => {
        console.log('loadAverageOrderValues', averageOrderValues);
        this.isLoading$.next(false);
        this.averageOrderValues$.next(averageOrderValues ?? []);
      });
  }

  loadAverageOrderValueSummary(): void {
    this.averageOrderValueSummarySubscription?.unsubscribe();
    this.averageOrderValueSummarySubscription = this.averageOrderValuesService
      .getComputedAverageOrderValueSummary()
      .subscribe((averageOrderValueSummary) => {
        this.averageOrderValueSummary$.next(averageOrderValueSummary);
      });
  }

  loadAverageOrderValueChartData(): void {
    this.averageOrderValueChartDataSubscription?.unsubscribe();
    this.averageOrderValueChartDataSubscription = this.averageOrderValuesService
      .getAverageOrderValueChartData()
      .subscribe((averageOrderValueChartData) => {
        this.averageOrderValueChartData$.next(averageOrderValueChartData);
      });
  }
}
