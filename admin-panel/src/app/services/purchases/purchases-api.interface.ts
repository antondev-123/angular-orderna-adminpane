import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  PurchaseCreateData,
  IPurchase,
  PurchaseUpdateData,
  PurchaseUpdateNote,
} from '../../model/purchase';

export interface IPurchasesApiService {
  createPurchaseItem(purchase: PurchaseCreateData): Observable<IPurchase>;
  updatePurchaseItem(purchase: PurchaseUpdateData): Observable<IPurchase>;
  deletePurchase(purchaseId: IPurchase['id']): Observable<IPurchase>;
  deletePurchases(purchaseIds: IPurchase['id'][]): Observable<IPurchase[]>;
  deleteAllPurchases(): Observable<IPurchase[]>;
  deleteAllPurchasesExcept(
    purchaseIds: IPurchase['id'][]
  ): Observable<IPurchase[]>;
  getPurchaseItem(
    option: QueryOptions<IPurchase>
  ): Observable<Maybe<IPurchase[]>>;
  getTotalPurchaseItem(): Observable<Maybe<number>>;
}
