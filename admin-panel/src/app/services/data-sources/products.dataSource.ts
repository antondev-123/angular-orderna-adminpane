import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IProduct } from '../../model/product';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { ProductsApiService } from '../products/products-api.service';

@Injectable()
export class ProductsDataSource extends DataSource<IProduct> {
  products$ = new BehaviorSubject<IProduct[]>([]);
  totalProducts$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private productsSubscription: Maybe<Subscription>;
  private totalProductsSubscription: Maybe<Subscription>;

  constructor(private productsService: ProductsApiService) {
    super();
  }

  connect(): Observable<IProduct[]> {
    return this.products$.asObservable();
  }

  disconnect(): void {
    this.products$.complete();
    this.totalProducts$.complete();
    this.isLoading$.complete();
    this.productsSubscription?.unsubscribe();
    this.totalProductsSubscription?.unsubscribe();
  }

  loadTotalProducts(): void {
    this.totalProductsSubscription?.unsubscribe();
    this.totalProductsSubscription = this.productsService
      .numberOfProducts()
      .subscribe((totalProducts) => {
        this.totalProducts$.next(totalProducts ?? 0);
      });
  }

  loadProducts(options: QueryOptions<IProduct>): void {
    this.isLoading$.next(true);
    this.productsSubscription?.unsubscribe();
    this.productsSubscription = this.productsService
      .getProducts(options)
      .subscribe((products) => {
        console.log('loadProducts', products);
        this.isLoading$.next(false);
        this.products$.next(products.data.product ?? []);
      });
  }
}
