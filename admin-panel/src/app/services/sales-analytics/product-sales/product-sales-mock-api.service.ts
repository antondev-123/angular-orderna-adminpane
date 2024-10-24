import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IProductSalesApiService } from './product-sales-api.interface';
import { fetchProductSales } from '../../../data/product-sales';
import { ProductSale, IProductSale } from '../../../model/product-sale';

@Injectable({
  providedIn: 'root',
})
export class ProductSalesMockApiService implements IProductSalesApiService {
  data = {
    product_sales: {
      items: [] as ProductSale[],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<IProductSale>,
      subject: new BehaviorSubject<Maybe<ProductSale[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get productSalesData() {
    return this.data['product_sales'] as Data<ProductSale, IProductSale>;
  }

  getProductSales(
    options: QueryOptions<IProductSale>
  ): Observable<Maybe<IProductSale[]>> {
    this.productSalesData.items = fetchProductSales(options);

    let newOptions: QueryOptions<IProductSale> = {
      page: options.page,
      perPage: options.perPage,
      sort: options.sort,
    };

    if (options.filters?.find((f) => f.field === 'perPage')) {
      newOptions.perPage = +options.filters?.find((f) => f.field === 'perPage')!
        .value;
    }

    return filterItems(this.productSalesData, newOptions);
  }

  getTotalProductSales(): Observable<Maybe<number>> {
    return getTotalItems(this.productSalesData);
  }
}
