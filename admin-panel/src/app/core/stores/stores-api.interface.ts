import { Observable } from 'rxjs';
import { ICategory } from '../../model/category';
import { IProduct } from '../../model/product';
import {
  IStore,
  IOpeningHours,
  Store,
  StoreCreateData,
  StoreNameData,
  IStoreDashboardComparison,
  IStoreDashboardSummary,
} from '../../model/store';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { DateFilter } from '@orderna/admin-panel/src/types/date-filter';
import { IDashboardFilter } from '../../features/dashboard/dashboard-header/dashboard-header.component';
import { Data } from '@orderna/admin-panel/src/utils/service';

export interface IStoresApiService {
  storesData: Data<Store, IStore>;
  createStore: (store: StoreCreateData) => Observable<Store>;
  getStores: (
    page: number,
    itemsPerPage: number
  ) => Observable<{ count: number; data: Store[] }>;
  getStoreNames(): Observable<Maybe<StoreNameData[]>>;
  getStoreSummaryData(
    filter: IDashboardFilter,
    dateFilter?: DateFilter
  ): Observable<Maybe<IStoreDashboardSummary[]>>;
  compareStores(
    stores: number[]
  ): Observable<Maybe<IStoreDashboardComparison[]>>;
  getCategories: () => Observable<ICategory[]>;
  getProductById: (productId: number) => Observable<IProduct | undefined>;
  getTotalItemCount: () => Observable<number>;
  searchStores: (searchTerm: string) => Observable<Store[]>;
  getStoreById: (storeId: number) => Observable<IStore | undefined>;
  getStoreBySlug: (slug: Store['slug']) => Observable<Store>;
  updateStoreById: (
    storeId: number,
    storeData: Partial<IStore>
  ) => Observable<Store>;
  updateStoreBySlug: (
    slug: Store['slug'],
    storeData: Partial<IStore>
  ) => Observable<Store>;
  getStoreOpeningHours: (storeId: number) => Observable<IOpeningHours[]>;
  updateStoreOpeningHours: (
    storeId: number,
    openingHours: IOpeningHours[]
  ) => Observable<boolean>;
  deleteStore(storeId: Store['id']): Observable<boolean>;
}
