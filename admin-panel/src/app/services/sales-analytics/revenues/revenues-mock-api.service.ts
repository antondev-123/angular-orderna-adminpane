import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { IRevenuesApiService } from './revenues-api.interface';
import { fetchRevenues } from '../../../data/revenues';
import { Revenue, IRevenue } from '../../../model/revenue';

@Injectable({
  providedIn: 'root',
})
export class RevenuesMockApiService implements IRevenuesApiService {
  data = {
    revenues: {
      items: [] as Revenue[],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IRevenue>,
      subject: new BehaviorSubject<Maybe<Revenue[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get revenuesData() {
    return this.data['revenues'] as Data<Revenue, IRevenue>;
  }

  getRevenues(options: QueryOptions<IRevenue>): Observable<Maybe<IRevenue[]>> {
    this.revenuesData.items = fetchRevenues(options) ?? [];

    let newOptions: QueryOptions<IRevenue> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.revenuesData, newOptions);
  }

  getTotalRevenues(): Observable<Maybe<number>> {
    return getTotalItems(this.revenuesData);
  }

  getComputedRevenueSummary(): Observable<Maybe<IRevenue>> {
    const revenues = this.revenuesData.items;

    const orders = revenues
      ?.map((revenue) => revenue.orders)
      .reduce((acc, orders) => acc + orders, 0);
    const grossSales = revenues
      ?.map((revenue) => revenue.grossSales)
      .reduce((acc, grossSales) => acc + grossSales, 0);
    const discounts = revenues
      ?.map((revenue) => revenue.discounts)
      .reduce((acc, discounts) => acc + discounts, 0);

    return of({
      orders,
      grossSales,
      discounts,
    } as IRevenue).pipe(delay(1000));
  }

  getSalesOverTime(): Observable<Maybe<IRevenue[]>> {
    return of(this.revenuesData.items);
  }
}
