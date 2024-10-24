import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Injectable } from '@angular/core';
import { IPurchase } from '../../model/purchase';
import { PurchasesApiService } from '../purchases/purchases-api.service';

@Injectable()
export class PurchaseDataSource extends DataSource<IPurchase> {
  purchase$ = new BehaviorSubject<IPurchase[]>([]);
  totalPurchases$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private purchaseSubscription: Maybe<Subscription>;
  private totalPurchaseSubscription: Maybe<Subscription>;

  constructor(private purchasesService: PurchasesApiService) {
    super();
  }

  connect(): Observable<IPurchase[]> {
    return this.purchase$.asObservable();
  }

  disconnect(): void {
    this.purchase$.complete();
    this.totalPurchases$.complete();
    this.isLoading$.complete();
    this.purchaseSubscription?.unsubscribe();
    this.totalPurchaseSubscription?.unsubscribe();
  }

  loadTotalPurchase(): void {
    this.totalPurchaseSubscription?.unsubscribe();
    this.totalPurchaseSubscription = this.purchasesService
      .getTotalPurchaseItem()
      .subscribe((totalPurchases) => {
        this.totalPurchases$.next(totalPurchases ?? 0);
      });
  }

  loadPurchase(options: QueryOptions<IPurchase>): void {
    this.isLoading$.next(true);
    this.purchaseSubscription?.unsubscribe();
    this.purchaseSubscription = this.purchasesService
      .getPurchaseItem(options)
      .subscribe((purchases) => {
        console.log('loadpurchases', purchases);
        this.isLoading$.next(false);
        this.purchase$.next(purchases ?? []);
      });
  }
}
