import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Observable } from 'rxjs';
import {
  CustomerCreateData,
  ICustomer,
  CustomerUpdateData,
  Customer,
} from '../../model/customer';

export interface ICustomersApiService {
  createCustomer(customer: CustomerCreateData): Observable<ICustomer>;
  updateCustomer(customer: CustomerUpdateData): Observable<ICustomer>;
  deleteCustomer(customerId: ICustomer['id']): Observable<ICustomer>;
  deleteCustomers(customerIds: ICustomer['id'][]): Observable<ICustomer[]>;
  deleteAllCustomers(): Observable<ICustomer[]>;
  deleteAllCustomersExcept(
    customerIds: ICustomer['id'][]
  ): Observable<ICustomer[]>;
  getCustomers(option: QueryOptions<ICustomer>): Observable<Maybe<ICustomer[]>>;
  getTotalCustomers(): Observable<Maybe<number>>;
  getCustomer(customerId: ICustomer['id']): Observable<Maybe<Customer>>;
}
