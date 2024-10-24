import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  createItem,
  Data,
  deleteAllItems,
  deleteAllItemsExcept,
  deleteItem,
  deleteItems,
  filterItems,
  getTotalItems,
  updateItem,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IInventoryService } from './inventory-api.interface';
import {
  InventoryItemCreateData,
  IInventoryItem,
  InventoryItem,
  InventoryItemUpdateData,
} from '../../model/inventory';
import { INVENTORY_ITEMS } from '../../data/inventory';

@Injectable({
  providedIn: 'root',
})
export class InventoryMockApiService implements IInventoryService {
  data = {
    inventory: {
      items: [...INVENTORY_ITEMS],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IInventoryItem>,
      subject: new BehaviorSubject<Maybe<InventoryItem[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get inventoryData() {
    return this.data['inventory'] as Data<InventoryItem, IInventoryItem>;
  }

  createInventoryItem(
    inventory: InventoryItemCreateData
  ): Observable<IInventoryItem> {
    const newInventory = InventoryItem.fromJSON({
      ...inventory,
      id: this.inventoryData.items.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return createItem(this.inventoryData, newInventory);
  }

  updateInventoryItem(
    inventoryId:string,
    inventory: InventoryItemUpdateData
  ): Observable<IInventoryItem> {
    return updateItem(this.inventoryData, inventory);
  }

  deleteInventoryItem(
    inventoryId: InventoryItem['id']
  ): Observable<IInventoryItem> {
    return deleteItem(this.inventoryData, inventoryId);
  }

  deleteInventoryItems(
    inventoryIds: InventoryItem['id'][]
  ): Observable<IInventoryItem[]> {
    return deleteItems(this.inventoryData, inventoryIds);
  }

  deleteAllInventoryItems(): Observable<IInventoryItem[]> {
    return deleteAllItems(this.inventoryData);
  }

  deleteAllInventoryItemsExcept(
    inventoryIds: InventoryItem['id'][]
  ): Observable<IInventoryItem[]> {
    return deleteAllItemsExcept(this.inventoryData, inventoryIds);
  }

  getInventory(
    options: QueryOptions<IInventoryItem>
  ): Observable<Maybe<IInventoryItem[]>> {
    const andFilterByStore = (item: IInventoryItem) => {
      const storeFilter = options.filters?.find((f) => f.field === 'store');
      if (!storeFilter) return true;
      return item.storeId.id === +storeFilter.value;
    };
    return filterItems(this.inventoryData, options, andFilterByStore);
  }

  getInventoriesForModel(
    options: QueryOptions<IInventoryItem>
  ): Observable<Maybe<IInventoryItem[]>> {
    return filterItems(this.inventoryData, options);
  }

  getTotalInventoryItems(): Observable<Maybe<number>> {
    return getTotalItems(this.inventoryData);
  }
}
