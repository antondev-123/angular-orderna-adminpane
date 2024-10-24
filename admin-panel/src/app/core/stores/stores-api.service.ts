import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import {
  GetStoreResponseDto,
  IOpeningHours,
  IStore,
  IStoreDashboardComparison,
  Store,
  StoreCreateData,
  StoreNameData,
} from '../../model/store';
import { ICategory } from '../../model/category';
import { IProduct } from '../../model/product';

import { IDashboardFilter } from '../../features/dashboard/dashboard-header/dashboard-header.component';
import { DateFilter } from '@orderna/admin-panel/src/types/date-filter';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Data } from '@orderna/admin-panel/src/utils/service';
import { environment } from '@orderna/admin-panel/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoresApiService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.api}/stores`;

  data = {
    stores: {
      items: [],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IStore>,
      subject: new BehaviorSubject<Maybe<Store[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get storesData() {
    return this.data['stores'] as Data<Store, IStore>;
  }

  createStore(store: StoreCreateData): Observable<Store> {
    return this.http.post<Store>(this.API_URL, store);
  }

  getStores(
    limit: number,
    page: number,
    searchTerm?: string
  ): Observable<{ count: number; data: Store[] }> {
  
    let queryParams = `?limit=${limit}&page=${page}`;
  
    if (searchTerm) {
      queryParams += `&search=${encodeURIComponent(searchTerm)}`;
    }
  
    return this.http.get<{ count: number; data: Store[] }>(this.API_URL + queryParams);
  }
  getStoreSummaryData(
    filter: IDashboardFilter,
    dateFilter?: DateFilter
  ): Observable<any> {
    return this.http.get(`${this.API_URL}${'/summary'}`);
  }

  compareStores(
    stores: number[]
  ): Observable<Maybe<IStoreDashboardComparison[]>> {
    return this.http.get<IStoreDashboardComparison[]>(
      this.API_URL + 'stores/compare'
    );
  }

  getStoreNames(): Observable<Maybe<StoreNameData[]>> {
    return this.http.get<StoreNameData[]>(this.API_URL + '/name');
    // return this.http.get<GetStoreResponseDto>(this.API_URL).pipe(map((res) => res.data.store.map((store) => ({ id: store.id, name: store.name }))));
  }

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.API_URL}/categories/`);
  }

  getProductById(productId: number): Observable<IProduct | undefined> {
    return this.http.get<IProduct>(`${this.API_URL}/products/${productId}`);
  }

  getTotalItemCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/count`);
  }

  searchStores(searchTerm: string): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.API_URL}?search=${searchTerm}`);
  }

  getStoreById(storeId: number): Observable<IStore | undefined> {
    return this.http.get<IStore>(`${this.API_URL}/${storeId}`);
  }

  getStoreBySlug(slug: Store['slug']): Observable<Store> {
    return this.http.get<Store>(`${this.API_URL}/${slug}`);
  }

  updateStoreById(
    storeId: number,
    storeData: Partial<IStore>
  ): Observable<Store> {
    return this.http.put<Store>(`${this.API_URL}/${storeId}`, storeData);
  }

  updateStoreBySlug(
    slug: Store['slug'],
    storeData: Partial<IStore>
  ): Observable<Store> {
    return this.http.patch<Store>(`${this.API_URL}/${slug}`, storeData);
  }

  getStoreOpeningHours(storeId: number): Observable<IOpeningHours[]> {
    return this.http.get<IOpeningHours[]>(
      `${environment.api}/opening-hours/${storeId}`
    );
  }

  getOpeningHourById(storeId: number): Observable<IOpeningHours> {
    return this.http.get<IOpeningHours>(`${environment.api}/${'opening-hours'}/${storeId}`);
  }
  
  createStoreOpeningHours(storeId: number,openingHours: IOpeningHours[]): Observable<IOpeningHours[]> {
    return this.http.post<IOpeningHours[]>(`${environment.api}/${'opening-hours'}/${storeId}`, openingHours);
  }

  updateStoreOpeningHours(
    storeId: number,
    openingHours: IOpeningHours[]
  ): Observable<boolean> {
    return this.http.put<boolean>(
      `${environment.api}/opening-hours`,
      openingHours
    );
  }

  // TOOD: update response when integrated with backend
  getOpeningHours(): Observable<any> {
    return this.http.get<IOpeningHours[]>(`${this.API_URL}/opening-hours`);
  }

  deleteStore(storeIds: Store['id'][]): Observable<boolean> {
    return this.http.put<boolean>(`${this.API_URL}/${'delete-many'}`, {ids : storeIds});;
  }
}
