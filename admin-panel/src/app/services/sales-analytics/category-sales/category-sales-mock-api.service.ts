import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICategorySalesApiService } from './category-sales-api.interface';
import { fetchCategorySales } from '../../../data/category-sales';
import { CategorySale, ICategorySale } from '../../../model/category-sale';

@Injectable({
  providedIn: 'root',
})
export class CategorySalesMockApiService implements ICategorySalesApiService {
  data = {
    category_sales: {
      items: [] as CategorySale[],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<ICategorySale>,
      subject: new BehaviorSubject<Maybe<CategorySale[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get categorySalesData() {
    return this.data['category_sales'] as Data<CategorySale, ICategorySale>;
  }

  getCategorySales(
    options: QueryOptions<ICategorySale>
  ): Observable<Maybe<ICategorySale[]>> {
    this.categorySalesData.items = fetchCategorySales(options);

    let newOptions: QueryOptions<ICategorySale> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.categorySalesData, newOptions);
  }

  getTotalCategorySales(): Observable<Maybe<number>> {
    return getTotalItems(this.categorySalesData);
  }
}
