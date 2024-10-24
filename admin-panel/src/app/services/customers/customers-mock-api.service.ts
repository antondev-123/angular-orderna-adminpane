import { inject, Injectable } from '@angular/core';
import { ICustomersApiService } from './customers-api.interface';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  createItem,
  Data,
  deleteAllItems,
  deleteAllItemsExcept,
  deleteItem,
  deleteItems,
  filterItems,
  getItem,
  getTotalItems,
  updateItem,
} from '@orderna/admin-panel/src/utils/service';
import { CUSTOMERS } from '../../data/customers';
import { TRANSACTIONS } from '../../data/transactions';
import {
  ICustomer,
  Customer,
  CustomerCreateData,
  CustomerUpdateData,
} from '../../model/customer';
import { TransactionsApiService } from '../transactions/transactions-api.service';

@Injectable({
  providedIn: 'root',
})
export class CustomersMockApiService implements ICustomersApiService {
  transactionsService = inject(TransactionsApiService);
  data = {
    customers: {
      items: [...CUSTOMERS],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<ICustomer>,
      subject: new BehaviorSubject<Maybe<Customer[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get customersData() {
    return this.data['customers'] as Data<Customer, ICustomer>;
  }

  createCustomer(customer: CustomerCreateData): Observable<ICustomer> {
    const newCustomer = Customer.fromJSON({
      ...customer,
      id: this.customersData.items.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return createItem(this.customersData, newCustomer);
  }

  updateCustomer(customer: CustomerUpdateData): Observable<ICustomer> {
    return updateItem(this.customersData, customer);
  }

  deleteCustomer(customerId: Customer['id']): Observable<ICustomer> {
    return deleteItem(this.customersData, customerId);
  }

  deleteCustomers(customerIds: Customer['id'][]): Observable<ICustomer[]> {
    return deleteItems(this.customersData, customerIds);
  }

  deleteAllCustomers(): Observable<ICustomer[]> {
    return deleteAllItems(this.customersData);
  }

  deleteAllCustomersExcept(
    customerIds: Customer['id'][]
  ): Observable<ICustomer[]> {
    return deleteAllItemsExcept(this.customersData, customerIds);
  }

  getCustomers(
    options: QueryOptions<ICustomer>
  ): Observable<Maybe<ICustomer[]>> {
    if (options) {
      const andFilterByStore = (item: ICustomer) => {
        const storeFilter = options.filters?.find((f) => f.field === 'store');
        if (!storeFilter) return true;

        return TRANSACTIONS.some(
          (t) => t.user.id === item.id && t.store.id === +storeFilter.value
        );
      };
      return filterItems(this.customersData, options, andFilterByStore).pipe(
        map((customers) => {
          if (!customers) return null;
          return customers.map(
            (customer) =>
              this.transactionsService.addTransactionStatisticsToCustomer(
                customer
              )!
          );
        })
      );
    } else {
      return filterItems(this.customersData, options);
    }
  }

  getCustomer(customerId: ICustomer['id']): Observable<Maybe<Customer>> {
    return getItem(this.customersData, customerId).pipe(
      map((customer) =>
        this.transactionsService.addTransactionStatisticsToCustomer(customer)
      )
    );
  }

  getTotalCustomers(): Observable<Maybe<number>> {
    return getTotalItems(this.customersData);
  }
}
