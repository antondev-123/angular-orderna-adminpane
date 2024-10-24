import { Injectable } from '@angular/core';
import { IZReport } from '../../model/z-report';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ZReportsApiService } from '../sales-analytics/z-reports/z-reports-api.service';

@Injectable()
export class ZReportsDataSource extends DataSource<IZReport> {
  zReports$ = new BehaviorSubject<IZReport[]>([]);
  totalZReports$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);
  zReportSummary$ = new BehaviorSubject<Maybe<IZReport>>(null);

  private zReportsSubscription: Maybe<Subscription>;
  private totalZReportsSubscription: Maybe<Subscription>;
  private zReportSummarySubscription: Maybe<Subscription>;

  constructor(private zReportsService: ZReportsApiService) {
    super();
  }

  connect(): Observable<IZReport[]> {
    return this.zReports$.asObservable();
  }

  disconnect(): void {
    this.zReports$.complete();
    this.totalZReports$.complete();
    this.isLoading$.complete();
    this.zReportSummary$.complete();
    this.zReportsSubscription?.unsubscribe();
    this.totalZReportsSubscription?.unsubscribe();
    this.zReportSummarySubscription?.unsubscribe();
  }

  loadTotalZReports(): void {
    this.totalZReportsSubscription?.unsubscribe();
    this.totalZReportsSubscription = this.zReportsService
      .getTotalZReports()
      .subscribe((totalZReports) => {
        this.totalZReports$.next(totalZReports ?? 0);
      });
  }

  loadZReports(options: QueryOptions<IZReport>): void {
    this.isLoading$.next(true);
    this.zReportsSubscription?.unsubscribe();
    this.zReportsSubscription = this.zReportsService
      .getZReports(options)
      .subscribe((zReports) => {
        console.log('loadZReports', zReports);
        this.isLoading$.next(false);
        this.zReports$.next(zReports ?? []);
      });
  }

  loadZReportSummary(): void {
    this.zReportSummarySubscription?.unsubscribe();
    this.zReportSummarySubscription = this.zReportsService
      .getComputedZReportSummary()
      .subscribe((zReportSummary) => {
        this.zReportSummary$.next(zReportSummary ?? null);
      });
  }
}
