import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ICustomer } from '../../model/customer';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { CustomersApiService } from '../customers/customers-api.service';

@Injectable()
export class CustomersDataSource extends DataSource<ICustomer> {
  customers$ = new BehaviorSubject<ICustomer[]>([]);
  totalCustomers$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private customersSubscription: Maybe<Subscription>;
  private totalCustomersSubscription: Maybe<Subscription>;

  constructor(private customersService: CustomersApiService) {
    super();
  }

  connect(): Observable<ICustomer[]> {
    return this.customers$.asObservable();
  }

  disconnect(): void {
    this.customers$.complete();
    this.totalCustomers$.complete();
    this.isLoading$.complete();
    this.customersSubscription?.unsubscribe();
    this.totalCustomersSubscription?.unsubscribe();
  }

  loadTotalCustomers(): void {
    this.totalCustomersSubscription?.unsubscribe();
    this.totalCustomersSubscription = this.customersService
      .getTotalCustomers()
      .subscribe((totalCustomers) => {
        this.totalCustomers$.next(totalCustomers ?? 0);
      });
  }

  loadCustomers(options: QueryOptions<ICustomer>): void {
    this.isLoading$.next(true);
    this.customersSubscription?.unsubscribe();
    this.customersSubscription = this.customersService
      .getCustomers(options)
      .subscribe((customers) => {
        console.log('loadCustomers', customers);
        this.isLoading$.next(false);
        this.customers$.next(customers ?? []);
      });
  }
}
