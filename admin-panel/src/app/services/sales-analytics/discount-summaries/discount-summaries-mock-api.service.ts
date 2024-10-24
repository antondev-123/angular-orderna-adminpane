import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { IDiscountSummariesApiService } from './discount-summaries-api.interface';
import { fetchDiscountSummaries } from '../../../data/discount-summaries';
import {
  SaleDiscountSummary,
  ISaleDiscountSummary,
} from '../../../model/discount-summary';

@Injectable({
  providedIn: 'root',
})
export class DiscountSummariesMockApiService
  implements IDiscountSummariesApiService
{
  data = {
    discount_summaries: {
      items: [] as SaleDiscountSummary[],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<ISaleDiscountSummary>,
      subject: new BehaviorSubject<Maybe<SaleDiscountSummary[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get discountSummariesData() {
    return this.data['discount_summaries'] as Data<
      SaleDiscountSummary,
      ISaleDiscountSummary
    >;
  }

  getDiscountSummaries(
    options: QueryOptions<ISaleDiscountSummary>
  ): Observable<Maybe<ISaleDiscountSummary[]>> {
    this.discountSummariesData.items = fetchDiscountSummaries(options);

    let newOptions: QueryOptions<ISaleDiscountSummary> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.discountSummariesData, newOptions);
  }

  getTotalDiscountSummaries(): Observable<Maybe<number>> {
    return getTotalItems(this.discountSummariesData);
  }

  getDiscountSummaryChartData(): Observable<Maybe<ISaleDiscountSummary[]>> {
    return of(this.discountSummariesData.items).pipe(delay(1000));
  }
}
