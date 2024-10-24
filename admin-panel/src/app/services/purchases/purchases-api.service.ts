import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IPurchasesApiService } from './purchases-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  PurchaseCreateData,
  PurchaseUpdateData,
  IPurchase,
  PurchaseUpdateNote,
} from '../../model/purchase';
import { environment } from '@orderna/admin-panel/src/environments/environment';

let API_URL = `${environment.api}/`;

@Injectable({
  providedIn: 'root',
})
export class PurchasesApiService implements IPurchasesApiService {
  private http = inject(HttpClient);

  createPurchaseItem(purchases: PurchaseCreateData): Observable<any> {
    return this.http.post(
      API_URL + 'purchases',
      JSON.stringify(purchases)
    );
  }

  updatePurchaseItem(user: PurchaseUpdateData): Observable<any> {
    return this.http.put(API_URL + 'purchase-update', JSON.stringify(user));
  }

  deletePurchase(userId: IPurchase['id']): Observable<any> {
    return this.http.post(API_URL + 'purchase-delete', userId);
  }

  deletePurchases(userIds: IPurchase['id'][]): Observable<any> {
    return this.http.post(API_URL + 'purchases-delete-some', userIds);
  }

  deleteAllPurchases(): Observable<any> {
    return this.http.delete(API_URL + 'purchases-delete-all');
  }

  deleteAllPurchasesExcept(purchasesIDs: IPurchase['id'][]): Observable<any> {
    return this.http.post(
      API_URL + 'purchases-delete-all-except',
      purchasesIDs
    );
  }

  getPurchaseItem(_options: QueryOptions<IPurchase>): Observable<any> {
    return this.http.get(API_URL + 'purchases');
  }

  getTotalPurchaseItem(): Observable<any> {
    return this.http.get(API_URL + 'purchases-number');
  }
}
