import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAllTransactionsApiService } from './all-transactions-api.interface';
import { User } from '../../../model/user';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ITransaction } from '../../../model/transaction';
import { ACCOUNTING_ANALYTICS_API_URL } from '../accounting-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class AllTransactionsApiService implements IAllTransactionsApiService {
  currentUser: User;
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    this.headers = new HttpHeaders({
      authorization: 'Bearer ' + this.currentUser.token,
      'Content-Type': 'application/json; charset=UTF-8',
    });
  }

  getTotalTransactions(): Observable<any> {
    return this.http.get(ACCOUNTING_ANALYTICS_API_URL + 'transaction-number', {
      headers: this.headers,
    });
  }

  getAllTransactions(_options: QueryOptions<ITransaction>): Observable<any> {
    return this.http.get(ACCOUNTING_ANALYTICS_API_URL + 'all-transactions', {
      headers: this.headers,
    });
  }
}
