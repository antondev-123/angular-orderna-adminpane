import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { IInventoryItem } from '../../model/inventory';
import { InventoryApiService } from '../inventory/inventory-api.service';

@Injectable()
export class InventorysDataSource extends DataSource<IInventoryItem> {
  inventorys$ = new BehaviorSubject<IInventoryItem[]>([]);
  totalInventorys$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private inventorysSubscription: Maybe<Subscription>;
  private totalInventorysSubscription: Maybe<Subscription>;

  constructor(private inventoryService: InventoryApiService) {
    super();
  }

  connect(): Observable<IInventoryItem[]> {
    return this.inventorys$.asObservable();
  }

  disconnect(): void {
    this.inventorys$.complete();
    this.totalInventorys$.complete();
    this.isLoading$.complete();
    this.inventorysSubscription?.unsubscribe();
    this.totalInventorysSubscription?.unsubscribe();
  }

  loadTotalInventorys(): void {
    this.totalInventorysSubscription?.unsubscribe();
    this.totalInventorysSubscription = this.inventoryService
      .getTotalInventoryItems()
      .subscribe((totalInventorys) => {
        this.totalInventorys$.next(totalInventorys ?? 0);
      });
  }

  loadInventorys(options: QueryOptions<IInventoryItem>): void {
    this.isLoading$.next(true);
    this.inventorysSubscription?.unsubscribe();
    this.inventorysSubscription = this.inventoryService
      .getInventory(options)
      .subscribe((inventorys) => {
        this.isLoading$.next(false);
        this.inventorys$.next(inventorys.data.inventories ?? []);
        this.totalInventorys$.next(inventorys.data.total_record ?? 0);
      });
  }
  loadInventorysFormodel(options: QueryOptions<IInventoryItem>): void {
    this.isLoading$.next(true);
    this.inventorysSubscription?.unsubscribe();
    this.inventorysSubscription = this.inventoryService
      .getInventoriesForModel(options)
      .subscribe((inventorys) => {
        this.isLoading$.next(false);
        this.inventorys$.next(inventorys.data.inventories ?? []);
      });
  }
}
