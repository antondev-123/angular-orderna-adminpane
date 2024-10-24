import { inject, Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable, of } from 'rxjs';
import { ISalesApiService } from './sales-api.interface';
import { DateFilter } from '@orderna/admin-panel/src/types/date-filter';
import { getRandomNumber } from '@orderna/admin-panel/src/utils/dummy-data';
import { ITopSoldProduct, ITotalSales } from '../../model/product';
import { IDashboardFilter } from '../../features/dashboard/dashboard-header/dashboard-header.component';
import { ProductsApiService } from '../products/products-api.service';

@Injectable({
  providedIn: 'root',
})
export class SalesMockApiService implements ISalesApiService {
  productsService = inject(ProductsApiService);

  getTopSales(filter: IDashboardFilter): Observable<ITopSoldProduct[]> {
    const topSales = Array.from({ length: 10 }, (_, i) => {
      const randomProduct =
        this.productsService.productsData.items[
          Math.floor(
            Math.random() * this.productsService.productsData.items.length
          )
        ];
      return {
        id: i,
        productName: randomProduct.title,
        totalSold: getRandomNumber(100, 999),
        totalRevenue: getRandomNumber(100, 999),
      };
    });

    return of(topSales);
  }

  getTotalSales(filter: IDashboardFilter): Observable<Maybe<ITotalSales[]>> {
    const dateBetweenDates: Date[] = [];
    let startDate = filter.dateFilter ? new Date() : new Date(filter.startDate);
    let endDate = filter.dateFilter ? new Date() : new Date(filter.endDate);
    console.log(console.log('FILTER DATE FILTER ', startDate, endDate));
    if (filter.dateFilter) {
      if (
        filter.dateFilter.toLocaleLowerCase() ===
        DateFilter.LAST_7_DAYS.toLocaleLowerCase()
      ) {
        startDate.setDate(startDate.getDate() - 6);
      } else if (
        filter.dateFilter.toLocaleLowerCase() ===
        DateFilter.LAST_4_WEEKS.toLocaleLowerCase()
      ) {
        startDate.setDate(startDate.getDate() - 27);
      } else if (
        filter.dateFilter.toLocaleLowerCase() ===
        DateFilter.LAST_12_MONTHS.toLocaleLowerCase()
      ) {
        startDate.setMonth(startDate.getMonth() - 11);
      }
    }

    while (startDate <= endDate) {
      dateBetweenDates.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    const totalSales = Array.from(
      { length: dateBetweenDates.length },
      (_, i) => {
        return {
          id: i,
          productName: 'Product ' + i,
          totalSold: getRandomNumber(10, 999),
          date: dateBetweenDates[i],
        };
      }
    );
    return of(totalSales);
  }
}
