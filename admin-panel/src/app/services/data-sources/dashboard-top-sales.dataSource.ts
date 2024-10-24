import { DataSource } from '@angular/cdk/collections';
import { ITopSoldProduct, ITopSoldProductKeys } from '../../model/product';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '../../../types/maybe';
import { IDashboardFilter } from '../../features/dashboard/dashboard-header/dashboard-header.component';
import { SalesApiService } from '../sales/sales-api.service';

export class DashboardTopSalesDataSource extends DataSource<ITopSoldProduct> {
  topSoldProducts$ = new BehaviorSubject<ITopSoldProduct[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);
  initialValues: ITopSoldProduct[] = [];

  private topSoldProductsSubscription: Maybe<Subscription>;

  constructor(private salesService: SalesApiService) {
    super();
  }

  connect(): Observable<ITopSoldProduct[]> {
    return this.topSoldProducts$.asObservable();
  }

  disconnect(): void {
    this.topSoldProducts$.complete();
    this.isLoading$.complete();
    this.topSoldProductsSubscription?.unsubscribe();
  }

  loadTotalSales(filter: IDashboardFilter): void {
    this.topSoldProductsSubscription?.unsubscribe();
    this.topSoldProductsSubscription = this.salesService
      .getTopSales(filter)
      .subscribe((topSoldProducts) => {
        this.initialValues = topSoldProducts;
        this.topSoldProducts$.next(topSoldProducts ?? []);
      });
  }

  resetBestSellers(): void {
    this.topSoldProducts$.next([]);
  }

  sortTotalSales(
    field?: ITopSoldProductKeys,
    direction?: 'asc' | 'desc'
  ): void {
    if (!field || !direction) {
      this.topSoldProducts$.next(this.initialValues);
    }
    this.topSoldProducts$.next(
      this.topSoldProducts$.value.sort((a, b) => {
        if (a[field!] < b[field!]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[field!] > b[field!]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    );
  }
}
