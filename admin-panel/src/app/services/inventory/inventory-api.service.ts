import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { IInventoryService } from './inventory-api.interface';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  InventoryItem,
  IInventoryItem,
  InventoryItemCreateData,
  InventoryItemUpdateData,
} from '../../model/inventory';
import { Data } from '@orderna/admin-panel/src/utils/service';
import { environment } from '@orderna/admin-panel/src/environments/environment';

let API_URL = `${environment.api}/`;

@Injectable({
  providedIn: 'root',
})
export class InventoryApiService implements IInventoryService {
  private http = inject(HttpClient);

  data = {
    inventory: {
      items: [] as InventoryItem[],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IInventoryItem>,
      subject: new BehaviorSubject<Maybe<InventoryItem[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };
  get inventoryData() {
    return this.data['inventory'] as Data<InventoryItem, IInventoryItem>;
  }

  createInventoryItem(inventory: InventoryItemCreateData): Observable<any> {
    return this.http.post(
      API_URL + 'inventories',
      JSON.stringify(inventory)
    );
  }

  updateInventoryItem(inventoryId:any,inventory: InventoryItemUpdateData): Observable<any> {
    
    if ((inventory as any)['id']) {
      delete (inventory as any)['id'];
    }
    return this.http.patch<IInventoryItem>(
     `${API_URL}${'inventories'}/${inventoryId}`,
      JSON.stringify(inventory)
    );
  }

  deleteInventoryItem(inventoryId: IInventoryItem['id']): Observable<any> {
    return this.http.delete(`${API_URL}${'inventories'}/${inventoryId}`);
  }
  deleteInventoryItems(inventoryIds: IInventoryItem['id'][]): Observable<any> {
    return this.http.put(API_URL + 'inventories/delete-many', {ids : inventoryIds});
  }

  deleteAllInventoryItems(): Observable<any> {
    return this.http.delete(API_URL + 'Inventory-delete-all');
  }

  deleteAllInventoryItemsExcept(
    inventoryIds: IInventoryItem['id'][]
  ): Observable<any> {
    return this.http.post(
      API_URL + 'Inventory-delete-all-except',
      inventoryIds
    );
  }

  getInventory(options: QueryOptions<IInventoryItem>): Observable<any> {
    let queryParams = `?size=${options.perPage}&page=${options.page}`;  
    if(options.searchQuery) queryParams += `&search=${options.searchQuery}`;   
    return this.http.get(API_URL + 'inventories' + queryParams);
  }

  getTotalInventoryItems(): Observable<any> {
    return this.http.get(API_URL + 'inventories');
  }

  getInventoriesForModel(
    _options: QueryOptions<IInventoryItem>
  ): Observable<any> {
    return this.http.get(API_URL + 'inventories');
  }
}
