import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { ITimeOfDaySalesApiService } from './time-of-day-sales-api.interface';
import { fecthTimeOfDaySales } from '../../../data/time-of-day-sales';
import { ITimeOfDaySale, TimeOfDaySale } from '../../../model/time-of-day-sale';

@Injectable({
  providedIn: 'root',
})
export class TimeOfDaySalesMockApiService implements ITimeOfDaySalesApiService {
  data = {
    time_of_day_sales: {
      items: [] as TimeOfDaySale[],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<ITimeOfDaySale>,
      subject: new BehaviorSubject<Maybe<TimeOfDaySale[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get timeOfDaySalesData() {
    return this.data['time_of_day_sales'] as Data<
      TimeOfDaySale,
      ITimeOfDaySale
    >;
  }

  getTimeOfDaySales(
    options: QueryOptions<ITimeOfDaySale>
  ): Observable<Maybe<ITimeOfDaySale[]>> {
    this.timeOfDaySalesData.items = fecthTimeOfDaySales(options);

    let newOptions: QueryOptions<ITimeOfDaySale> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.timeOfDaySalesData, newOptions);
  }

  getTotalTimeOfDaySales(): Observable<Maybe<number>> {
    return getTotalItems(this.timeOfDaySalesData);
  }

  getTimeOfDaySaleChartData(): Observable<Maybe<ITimeOfDaySale[]>> {
    return of(this.timeOfDaySalesData.items).pipe(delay(1000));
  }
}
