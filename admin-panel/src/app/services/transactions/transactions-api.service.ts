import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../../model/category';
import { ITransactionsApiService } from './transactions-api.interface';

import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Data } from '@orderna/admin-panel/src/utils/service';
import { TRANSACTIONS } from '../../data/transactions';
import {
  ITransaction,
  Transaction,
  TransactionCreateData,
  TransactionUpdateData,
} from '../../model/transaction';
import { Customer, ICustomer } from '../../model/customer';
import { Product } from '../../model/product';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class TransactionsApiService implements ITransactionsApiService {
  private http = inject(HttpClient);

  data = {
    transactions: {
      items: [...TRANSACTIONS],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<ITransaction>,
      subject: new BehaviorSubject<Maybe<Transaction[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get transactionsData() {
    return this.data['transactions'] as Data<Transaction, ITransaction>;
  }

  addTransactionStatisticsToCustomer(
    customer: Maybe<Customer>
  ): Customer | null {
    // TODO
    return customer ?? new Customer();
  }

  getCustomerTransactions(
    customerId: ICustomer['id'],
    options?: QueryOptions<ITransaction>
  ): Observable<Maybe<Transaction[]>> {
    return this.http.get<Transaction[]>(
      API_URL + `customers/${customerId}/transactions`
    );
  }

  getCustomerTransactionCountsByCategory(
    customerId: ICustomer['id'],
    options?: QueryOptions<ITransaction>
  ): Observable<{ [category: Category['name']]: number }> {
    return this.http.get<{ [category: Category['name']]: number }>(
      API_URL + `customers/${customerId}/transactions`
    );
  }

  getCustomerTopRecentProducts(
    customerId: ICustomer['id'],
    options?: QueryOptions<ITransaction>
  ): Observable<Product['title'][]> {
    return this.http.get<Product['title'][]>(
      API_URL + `customers/${customerId}/top-5-recent-products`
    );
  }

  getTotalTransactions(): Observable<any> {
    return this.http.get(API_URL + 'transaction-number');
  }

  getTransaction(id: Transaction['id']): Observable<any> {
    return this.http.get(API_URL + 'transactions/' + id);
  }

  getTransactions(_options: QueryOptions<ITransaction>): Observable<any> {
    return this.http.get(API_URL + 'transactions');
  }

  createTransaction(transaction: TransactionCreateData): Observable<any> {
    return this.http.post(
      API_URL + 'transaction-create',
      JSON.stringify(transaction)
    );
  }

  updateTransaction(transaction: TransactionUpdateData): Observable<any> {
    return this.http.put(
      API_URL + 'transaction-update',
      JSON.stringify(transaction)
    );
  }

  deleteTransaction(transactionId: ITransaction['id']): Observable<any> {
    return this.http.post(API_URL + 'transaction-delete', transactionId);
  }

  deleteTransactions(transactionIds: ITransaction['id'][]): Observable<any> {
    return this.http.post(API_URL + 'transaction-delete-some', transactionIds);
  }

  deleteAllTransactions(): Observable<any> {
    return this.http.delete(API_URL + 'transaction-delete-all');
  }

  deleteAllTransactionsExcept(
    transactionIds: ITransaction['id'][]
  ): Observable<any> {
    return this.http.post(
      API_URL + 'transaction-delete-all-except',
      transactionIds
    );
  }
}
