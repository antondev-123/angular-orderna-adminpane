import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ISupplier } from '../../model/supplier';
import { DataSource } from '@angular/cdk/collections';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Injectable } from '@angular/core';
import { SuppliersApiService } from '../suppliers/suppliers-api.service';

@Injectable()
export class SuppliersDataSource extends DataSource<ISupplier> {
  suppliers$ = new BehaviorSubject<ISupplier[]>([]);
  totalSuppliers$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private suppliersSubscription: Maybe<Subscription>;
  private totalSuppliersSubscription: Maybe<Subscription>;

  constructor(private suppliersService: SuppliersApiService) {
    super();
  }

  connect(): Observable<ISupplier[]> {
    return this.suppliers$.asObservable();
  }

  disconnect(): void {
    this.suppliers$.complete();
    this.totalSuppliers$.complete();
    this.isLoading$.complete();
    this.suppliersSubscription?.unsubscribe();
    this.totalSuppliersSubscription?.unsubscribe();
  }

  loadTotalSuppliers(): void {
    this.totalSuppliersSubscription?.unsubscribe();
    this.totalSuppliersSubscription = this.suppliersService
      .getTotalSuppliers()
      .subscribe((totalSuppliers) => {
        this.totalSuppliers$.next(totalSuppliers ?? 0);
      });
  }

  loadSuppliers(options: QueryOptions<ISupplier>): void {
    this.isLoading$.next(true);
    this.suppliersSubscription?.unsubscribe();
    this.suppliersSubscription = this.suppliersService
      .getSuppliers(options)
      .subscribe((suppliers) => {
        console.log('loadSupplier', suppliers);
        this.isLoading$.next(false);
        this.suppliers$.next(suppliers ?? []);
      });
  }
}
