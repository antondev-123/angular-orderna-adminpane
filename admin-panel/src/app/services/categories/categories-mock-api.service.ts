import { inject, Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { filterItems } from '@orderna/admin-panel/src/utils/service';
import { delay, Observable, of, throwError } from 'rxjs';
import { ICategoriesApiService } from './categories-api.interface';
import { StoresApiService } from '../../core/stores/stores-api.service';
import { DateFilter } from '@orderna/admin-panel/src/types/date-filter';
import { getRandomNumber } from '@orderna/admin-panel/src/utils/dummy-data';
import { Category, CategoryUpdateData } from '../../model/category';
import {
  Store,
  IStore,
  IStoreDashboardSummary,
  IStoreDashboardSummaryType,
} from '../../model/store';
import { IDashboardFilter } from '../../features/dashboard/dashboard-header/dashboard-header.component';

@Injectable({
  providedIn: 'root',
})
export class CategoriesMockApiService implements ICategoriesApiService {
  storesService = inject(StoresApiService);

  getCategoriesByStore(storeId: number): Observable<any> {
    const store = this.storesService.storesData.items.find(
      (s) => s.id === storeId
    );
    if (store) {
      return of(store.categories).pipe(delay(1000));
    } else {
      return throwError('No store found with given id : ' + storeId);
    }
  }

  createCategory(category: Category, storeId: number): Observable<any> {
    const store = this.storesService.storesData.items.find(
      (store: Store) => store.id === storeId
    );
    if (store) {
      category.products = [];
      store.categories.unshift({
        ...category,
        id: store.categories.length + 1,
      });
      return of(store.categories);
    } else {
      return throwError('No store found with given id : ' + storeId);
    }
  }

  updateCategory(
    category: CategoryUpdateData,
    storeId: number
  ): Observable<any> {
    const store = this.storesService.storesData.items.find(
      (store: Store) => store.id === storeId
    );
    if (store) {
      let categoryIndex = store.categories.findIndex(
        (cat) => cat.id === category.id
      );
      store.categories[categoryIndex] = {
        ...store.categories[categoryIndex],
        ...category,
      };
      return of(store.categories);
    } else {
      return throwError('No store found with given id : ' + storeId);
    }
  }

  deleteCategory(categoryId: Category['id']): Observable<boolean> {
    // Note: Looked up and deleted category from 1st store only
    // Although there are 120 stores, they're all pointing to the same
    // 'categories' object. So deleting category on the 1st store
    // would also delete the category in other stores.
    const store = this.storesService.storesData.items[0];
    const categoryIndex = store.categories.findIndex(
      (c) => c.id === categoryId
    );
    store.categories.splice(categoryIndex, 1);
    return of(true);
  }

  getStores(options: QueryOptions<IStore>): Observable<Maybe<IStore[]>> {
    return filterItems(this.storesService.storesData, options);
  }

  getStoreSummaryData(
    filter: IDashboardFilter,
    dateFilter?: DateFilter
  ): Observable<Maybe<IStoreDashboardSummary[]>> {
    return of([
      {
        title: IStoreDashboardSummaryType.TOTAL_TRANSACTIONS,
        value: getRandomNumber(100, 999),
        valueIsCurrency: false,
        percent: getRandomNumber(-20, 20),
        from: getRandomNumber(0, 10),
      },
      {
        title: IStoreDashboardSummaryType.AVERAGE_ORDER_VALUE,
        value: getRandomNumber(100, 999),
        valueIsCurrency: true,
        percent: getRandomNumber(-20, 20),
        from: getRandomNumber(0, 10),
      },
      {
        title: IStoreDashboardSummaryType.REVENUE,
        value: getRandomNumber(100, 999),
        valueIsCurrency: true,
        percent: getRandomNumber(-20, 20),
        from: getRandomNumber(0, 10),
      },
      {
        title: IStoreDashboardSummaryType.TOTAL_DISCOUNTS,
        value: getRandomNumber(100, 999),
        valueIsCurrency: true,
        percent: getRandomNumber(-20, 20),
        from: getRandomNumber(0, 10),
      },
      {
        title: IStoreDashboardSummaryType.COST_OF_GOODS,
        value: getRandomNumber(100, 999),
        valueIsCurrency: true,
        percent: getRandomNumber(-20, 20),
        from: getRandomNumber(0, 10),
      },
      {
        title: IStoreDashboardSummaryType.GROSS_PROFIT,
        value: 15.99,
        valueIsCurrency: true,
        percent: getRandomNumber(-20, 20),
        from: getRandomNumber(0, 10),
      },
    ]);
  }
}
