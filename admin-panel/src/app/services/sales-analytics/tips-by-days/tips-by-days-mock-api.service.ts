import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { ITipsByDaysApiService } from './tips-by-days-api.interface';
import { IBillingInvoice } from '../../../model/billing-invoice';
import { INVOICES } from '../../../data/invoices';
import { IInvoice, Invoice } from '../../../model/invoice';
import { fetchTipsByDays } from '../../../data/tips-by-days';
import { TipsByDay, ITipsByDay } from '../../../model/tips-by-day';

@Injectable({
  providedIn: 'root',
})
export class TipsByDaysMockApiService implements ITipsByDaysApiService {
  data = {
    tips_by_days: {
      items: [] as TipsByDay[],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<ITipsByDay>,
      subject: new BehaviorSubject<Maybe<TipsByDay[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get tipsByDaysData() {
    return this.data['tips_by_days'] as Data<TipsByDay, ITipsByDay>;
  }

  getTipsByDays(
    options: QueryOptions<ITipsByDay>
  ): Observable<Maybe<ITipsByDay[]>> {
    this.tipsByDaysData.items = fetchTipsByDays(options);

    let newOptions: QueryOptions<ITipsByDay> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.tipsByDaysData, newOptions);
  }

  getTotalTipsByDays(): Observable<Maybe<number>> {
    return getTotalItems(this.tipsByDaysData);
  }

  getComputedTipsByDaySummary(): Observable<Maybe<ITipsByDay>> {
    const values = this.tipsByDaysData.items;

    const tips = values
      .map((value) => value.tips)
      .reduce((acc, tips) => acc + tips, 0);

    return of({
      tips,
    } as ITipsByDay).pipe(delay(1000));
  }

  getTipsByDayChartData(): Observable<Maybe<ITipsByDay[]>> {
    return of(this.tipsByDaysData.items).pipe(delay(1000));
  }
}
