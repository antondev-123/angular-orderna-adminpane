import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { IAverageOrderValuesApiService } from './average-order-values-api.interface';
import { fetchAverageOrderValues } from '../../../data/average-order-values';
import {
  AverageOrderValue,
  IAverageOrderValue,
} from '../../../model/average-order-value';

@Injectable({
  providedIn: 'root',
})
export class AverageOrderValuesMockApiService
  implements IAverageOrderValuesApiService
{
  data = {
    average_order_values: {
      items: [] as AverageOrderValue[],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<IAverageOrderValue>,
      subject: new BehaviorSubject<Maybe<AverageOrderValue[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get averageOrderValuesData() {
    return this.data['average_order_values'] as Data<
      AverageOrderValue,
      IAverageOrderValue
    >;
  }

  getAverageOrderValues(
    options: QueryOptions<IAverageOrderValue>
  ): Observable<Maybe<IAverageOrderValue[]>> {
    this.averageOrderValuesData.items = fetchAverageOrderValues(options) ?? [];

    let newOptions: QueryOptions<IAverageOrderValue> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.averageOrderValuesData, newOptions);
  }

  getTotalAverageOrderValues(): Observable<Maybe<number>> {
    return getTotalItems(this.averageOrderValuesData);
  }

  getComputedAverageOrderValueSummary(): Observable<Maybe<IAverageOrderValue>> {
    const values = this.averageOrderValuesData.items;

    const orders = values
      .map((value) => value.orders)
      .reduce((acc, orders) => acc + orders, 0);

    const grossSales = values
      .map((value) => value.grossSales)
      .reduce((acc, grossSales) => acc + grossSales, 0);

    const averageOrderValue = values
      .map((value) => value.averageOrderValue)
      .reduce((acc, averageOrderValue) => acc + averageOrderValue, 0);

    return of({
      orders,
      grossSales,
      averageOrderValue,
    } as IAverageOrderValue).pipe(delay(1000));
  }

  getAverageOrderValueChartData(): Observable<Maybe<IAverageOrderValue[]>> {
    return of(this.averageOrderValuesData.items).pipe(delay(1000));
  }
}
