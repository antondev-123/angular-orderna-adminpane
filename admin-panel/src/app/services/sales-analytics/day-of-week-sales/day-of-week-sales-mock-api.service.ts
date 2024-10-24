import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { IDayOfWeekSalesApiService } from './day-of-week-sales-api.interface';
import { fetchDayOfWeekSales } from '../../../data/day-of-week-sales';
import { DayOfWeekSale, IDayOfWeekSale } from '../../../model/day-of-week-sale';

@Injectable({
  providedIn: 'root',
})
export class DayOfWeekSalesMockApiService implements IDayOfWeekSalesApiService {
  data = {
    day_of_week_sales: {
      items: [] as DayOfWeekSale[],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<IDayOfWeekSale>,
      subject: new BehaviorSubject<Maybe<DayOfWeekSale[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get dayOfWeekSalesData() {
    return this.data['day_of_week_sales'] as Data<
      DayOfWeekSale,
      IDayOfWeekSale
    >;
  }

  getDayOfWeekSales(
    options: QueryOptions<IDayOfWeekSale>
  ): Observable<Maybe<IDayOfWeekSale[]>> {
    this.dayOfWeekSalesData.items = fetchDayOfWeekSales(options);

    let newOptions: QueryOptions<IDayOfWeekSale> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.dayOfWeekSalesData, newOptions);
  }

  getTotalDayOfWeekSales(): Observable<Maybe<number>> {
    return getTotalItems(this.dayOfWeekSalesData);
  }

  getDayOfWeekSaleChartData(): Observable<Maybe<IDayOfWeekSale[]>> {
    return of(this.dayOfWeekSalesData.items).pipe(delay(1000));
  }
}
