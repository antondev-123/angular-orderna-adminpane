import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IStore, StoreNameData } from '../../model/store';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { StoresApiService } from '../../core/stores/stores-api.service';

@Injectable()
export class StoresDataSource extends DataSource<IStore> {
  stores$ = new BehaviorSubject<IStore[]>([]);
  storeNames$ = new BehaviorSubject<StoreNameData[]>([]);
  totalStores$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private storeNamesSubscription: Maybe<Subscription>;
  private storesSubscription: Maybe<Subscription>;
  // private totalStoresSubscription: Maybe<Subscription>;

  constructor(private storesService: StoresApiService) {
    super();
  }

  connect(): Observable<IStore[]> {
    return this.stores$.asObservable();
  }

  disconnect(): void {
    this.stores$.complete();
  }

  loadStoreNames(): void {
    this.storeNamesSubscription?.unsubscribe();
    this.storeNamesSubscription = this.storesService
      .getStoreNames()
      .subscribe((storeNames) => {
        this.storeNames$.next(storeNames ?? []);
      });
  }

  // loadTotalStores(): void {
  //   this.totalStoresSubscription?.unsubscribe();
  //   this.totalStoresSubscription = this.adminService
  //     .getTotalStores()
  //     .subscribe((totalStores) => {
  //       this.totalStores$.next(totalStores ?? 0);
  //     });
  // }

  loadStores(page: number, itemsPerPage: number): void {
    this.isLoading$.next(true);
    this.storesSubscription?.unsubscribe();
    this.storesSubscription = this.storesService
      .getStores(itemsPerPage,page,'')
      .subscribe((stores:any) => {
        this.isLoading$.next(false);
        this.stores$.next(stores.data.store ?? []);
      });
  }
}
