import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ICategorySale } from '../../model/category-sale';
import { CategorySalesApiService } from '../sales-analytics/category-sales/category-sales-api.service';

@Injectable()
export class CategorySalesDataSource extends DataSource<ICategorySale> {
  categorySales$ = new BehaviorSubject<ICategorySale[]>([]);
  totalCategorySales$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private categorySalesSubscription: Maybe<Subscription>;
  private totalCategorySalesSubscription: Maybe<Subscription>;

  constructor(private categorySalesService: CategorySalesApiService) {
    super();
  }

  connect(): Observable<ICategorySale[]> {
    return this.categorySales$.asObservable();
  }

  disconnect(): void {
    this.categorySales$.complete();
    this.totalCategorySales$.complete();
    this.isLoading$.complete();
    this.categorySalesSubscription?.unsubscribe();
    this.totalCategorySalesSubscription?.unsubscribe();
  }

  loadTotalCategorySales(): void {
    this.totalCategorySalesSubscription?.unsubscribe();
    this.totalCategorySalesSubscription = this.categorySalesService
      .getTotalCategorySales()
      .subscribe((totalCategorySales) => {
        this.totalCategorySales$.next(totalCategorySales ?? 0);
      });
  }

  loadCategorySales(options: QueryOptions<ICategorySale>): void {
    this.isLoading$.next(true);
    this.categorySalesSubscription?.unsubscribe();
    this.categorySalesSubscription = this.categorySalesService
      .getCategorySales(options)
      .subscribe((categorySales) => {
        console.log('loadCategorySales', categorySales);
        this.isLoading$.next(false);
        this.categorySales$.next(categorySales ?? []);
      });
  }
}
