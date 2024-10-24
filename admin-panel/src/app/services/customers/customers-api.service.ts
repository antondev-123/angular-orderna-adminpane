import { inject, Injectable } from '@angular/core';
import { ICustomersApiService } from './customers-api.interface';
import { HttpClient } from '@angular/common/http';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Observable } from 'rxjs';
import {
  CustomerCreateData,
  CustomerUpdateData,
  ICustomer,
} from '../../model/customer';

import { Maybe } from '@orderna/admin-panel/src/types/maybe';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class CustomersApiService implements ICustomersApiService {
  private http = inject(HttpClient);

  createCustomer(customer: CustomerCreateData): Observable<any> {
    return this.http.put(API_URL + 'customer-create', JSON.stringify(customer));
  }

  updateCustomer(customer: CustomerUpdateData): Observable<any> {
    return this.http.put(API_URL + 'customer-update', JSON.stringify(customer));
  }

  deleteCustomer(customerId: ICustomer['id']): Observable<any> {
    return this.http.post(API_URL + 'customer-delete', customerId);
  }

  deleteCustomers(customerIds: ICustomer['id'][]): Observable<any> {
    return this.http.post(API_URL + 'customer-delete-some', customerIds);
  }

  deleteAllCustomers(): Observable<any> {
    return this.http.delete(API_URL + 'customer-delete-all');
  }

  deleteAllCustomersExcept(customerIds: ICustomer['id'][]): Observable<any> {
    return this.http.post(API_URL + 'customer-delete-all-except', customerIds);
  }

  getCustomers(
    _options: QueryOptions<ICustomer>
  ): Observable<Maybe<ICustomer[]>> {
    return this.http.get<ICustomer[]>(API_URL + 'customers');
  }

  getCustomer(customerId: ICustomer['id']): Observable<any> {
    return this.http.get(API_URL + `customers/${customerId}`);
  }

  getTotalCustomers(): Observable<any> {
    return this.http.get(API_URL + 'customer-number');
  }
}
