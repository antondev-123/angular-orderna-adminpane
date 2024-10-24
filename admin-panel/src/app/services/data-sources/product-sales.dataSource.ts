import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IProductSale } from '../../model/product-sale';
import { ProductSalesApiService } from '../sales-analytics/product-sales/product-sales-api.service';

@Injectable()
export class ProductSalesDataSource extends DataSource<IProductSale> {
  productSales$ = new BehaviorSubject<IProductSale[]>([]);
  totalProductSales$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private productSalesSubscription: Maybe<Subscription>;
  private totalProductSalesSubscription: Maybe<Subscription>;

  constructor(private productSalesService: ProductSalesApiService) {
    super();
  }

  connect(): Observable<IProductSale[]> {
    return this.productSales$.asObservable();
  }

  disconnect(): void {
    this.productSales$.complete();
    this.totalProductSales$.complete();
    this.isLoading$.complete();
    this.productSalesSubscription?.unsubscribe();
    this.totalProductSalesSubscription?.unsubscribe();
  }

  loadTotalProductSales(): void {
    this.totalProductSalesSubscription?.unsubscribe();
    this.totalProductSalesSubscription = this.productSalesService
      .getTotalProductSales()
      .subscribe((totalProductSales) => {
        this.totalProductSales$.next(totalProductSales ?? 0);
      });
  }

  loadProductSales(options: QueryOptions<IProductSale>): void {
    this.isLoading$.next(true);
    this.productSalesSubscription?.unsubscribe();
    this.productSalesSubscription = this.productSalesService
      .getProductSales(options)
      .subscribe((productSales) => {
        console.log('loadProductSales', productSales);
        this.isLoading$.next(false);
        this.productSales$.next(productSales ?? []);
      });
  }
}
