import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { IZReportsApiService } from './z-reports-api.interface';
import { fetchZReports } from '../../../data/z-reports';
import { ZReport, IZReport } from '../../../model/z-report';

@Injectable({
  providedIn: 'root',
})
export class ZReportsMockApiService implements IZReportsApiService {
  data = {
    z_reports: {
      items: [] as ZReport[],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IZReport>,
      subject: new BehaviorSubject<Maybe<ZReport[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get zreportsData() {
    return this.data['z_reports'] as Data<ZReport, IZReport>;
  }

  getZReports(options: QueryOptions<IZReport>): Observable<Maybe<IZReport[]>> {
    this.zreportsData.items = fetchZReports(options) ?? [];

    let newOptions: QueryOptions<IZReport> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.zreportsData, newOptions);
  }

  getTotalZReports(): Observable<Maybe<number>> {
    return getTotalItems(this.zreportsData);
  }

  getComputedZReportSummary(): Observable<Maybe<IZReport>> {
    const reports = this.zreportsData.items;

    const averageValue = reports
      .map((report) => report.averageValue)
      .reduce((acc, report) => acc + report, 0);

    const cardPayments = reports
      .map((report) => report.cardPayments)
      .reduce((acc, cardPayments) => acc + cardPayments, 0);

    const cashPayments = reports
      .map((report) => report.cashPayments)
      .reduce((acc, cashPayments) => acc + cashPayments, 0);

    const deliveryFees = reports
      .map((report) => report.deliveryFees)
      .reduce((acc, deliveryFees) => acc + deliveryFees, 0);

    const discounts = reports
      .map((report) => report.discounts)
      .reduce((acc, discounts) => acc + discounts, 0);

    const grossRevenues = reports
      .map((report) => report.grossRevenues)
      .reduce((acc, grossRevenues) => acc + grossRevenues, 0);

    const quantityOfRefunds = reports
      .map((report) => report.quantityOfRefunds)
      .reduce((acc, quantityOfRefunds) => acc + quantityOfRefunds, 0);

    const serviceCharges = reports
      .map((report) => report.serviceCharges)
      .reduce((acc, serviceCharges) => acc + serviceCharges, 0);

    const tips = reports
      .map((report) => report.tips)
      .reduce((acc, tips) => acc + tips, 0);

    const totalRefunds = reports
      .map((report) => report.totalRefunds)
      .reduce((acc, totalRefunds) => acc + totalRefunds, 0);

    const totalTransactions = reports
      .map((report) => report.totalTransactions)
      .reduce((acc, totalTransactions) => acc + totalTransactions, 0);

    return of({
      averageValue,
      cardPayments,
      cashPayments,
      deliveryFees,
      discounts,
      grossRevenues,
      quantityOfRefunds,
      serviceCharges,
      tips,
      totalRefunds,
      totalTransactions,
    } as IZReport).pipe(delay(1000));
  }
}
