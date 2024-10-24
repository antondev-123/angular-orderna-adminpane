import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  InventoryItem,
  IInventoryItem,
  InventoryItemCreateData,
  InventoryItemUpdateData,
} from '../../model/inventory';
import { Data } from '@orderna/admin-panel/src/utils/service';

export interface IInventoryService {
  inventoryData: Data<InventoryItem, IInventoryItem>;
  createInventoryItem(
    inventory: InventoryItemCreateData
  ): Observable<IInventoryItem>;
  updateInventoryItem(
    inventoryId:string,
    inventory: InventoryItemUpdateData
  ): Observable<IInventoryItem>;
  deleteInventoryItem(
    inventoryId: IInventoryItem['id']
  ): Observable<IInventoryItem>;
  deleteInventoryItems(
    inventoryIds: IInventoryItem['id'][]
  ): Observable<IInventoryItem[]>;
  deleteAllInventoryItems(): Observable<IInventoryItem[]>;
  deleteAllInventoryItemsExcept(
    inventoryIds: IInventoryItem['id'][]
  ): Observable<IInventoryItem[]>;
  getInventory(
    option: QueryOptions<IInventoryItem>
  ): Observable<Maybe<IInventoryItem[]>>;
  getTotalInventoryItems(): Observable<Maybe<number>>;

  getInventoriesForModel(
    option: QueryOptions<IInventoryItem>
  ): Observable<Maybe<IInventoryItem[]>>;
}
