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
import { IPurchasesApiService } from './purchases-api.interface';
import { Purchases } from '../../data/purchases';
import { TRANSACTIONS } from '../../data/transactions';
import {
  IPurchase,
  Purchase,
  PurchaseCreateData,
  PurchaseUpdateData,
  PurchaseUpdateNote,
} from '../../model/purchase';

@Injectable({
  providedIn: 'root',
})
export class PurchasesMockApiService implements IPurchasesApiService {
  data = {
    purchases: {
      items: [...Purchases],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IPurchase>,
      subject: new BehaviorSubject<Maybe<Purchase[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get purchaseData() {
    return this.data['purchases'] as Data<Purchase, IPurchase>;
  }

  createPurchaseItem(purchase: PurchaseCreateData): Observable<IPurchase> {
    const newPurchase = Purchase.fromJSON({
      ...purchase,
      id: this.purchaseData.items.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalPrice: purchase.price * purchase.quantity,
    });
    return createItem(this.purchaseData, newPurchase);
  }

  updatePurchaseItem(purchase: PurchaseUpdateData): Observable<IPurchase> {
    return updateItem(this.purchaseData, purchase);
  }

  deletePurchase(purchaseId: Purchase['id']): Observable<IPurchase> {
    return deleteItem(this.purchaseData, purchaseId);
  }

  deletePurchases(purchaseIds: Purchase['id'][]): Observable<IPurchase[]> {
    return deleteItems(this.purchaseData, purchaseIds);
  }

  deleteAllPurchases(): Observable<IPurchase[]> {
    return deleteAllItems(this.purchaseData);
  }

  deleteAllPurchasesExcept(
    purchaseIds: Purchase['id'][]
  ): Observable<IPurchase[]> {
    return deleteAllItemsExcept(this.purchaseData, purchaseIds);
  }

  getPurchaseItem(
    options: QueryOptions<IPurchase>
  ): Observable<Maybe<IPurchase[]>> {
    const andFilterByStore = (item: IPurchase) => {
      const storeFilter = options.filters?.find((f) => f.field === 'store');
      if (!storeFilter) return true;
      return TRANSACTIONS.some(
        (t) => t.store.id === item.storeId.id && t.store.id === +storeFilter.value
      );
    };

    return filterItems(this.purchaseData, options, andFilterByStore);
  }

  getTotalPurchaseItem(): Observable<Maybe<number>> {
    return getTotalItems(this.purchaseData);
  }
}
