import { Observable } from 'rxjs';
import { Category } from '../../model/category';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Data } from '@orderna/admin-panel/src/utils/service';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Customer, ICustomer } from '../../model/customer';
import {
  Transaction,
  ITransaction,
  TransactionCreateData,
  TransactionUpdateData,
} from '../../model/transaction';
import { Product } from '../../model/product';

export interface ITransactionsApiService {
  transactionsData: Data<Transaction, ITransaction>;
  addTransactionStatisticsToCustomer(
    customer: Maybe<Customer>
  ): Customer | null;

  getTotalTransactions(): Observable<Maybe<number>>;
  getTransactions(
    option: QueryOptions<ITransaction>
  ): Observable<Maybe<{ count: number; data: Transaction[] }>>;
  getTransaction(id: Transaction['id']): Observable<Maybe<Transaction>>;
  createTransaction(
    transaction: TransactionCreateData
  ): Observable<ITransaction>;
  updateTransaction(
    transaction: TransactionUpdateData
  ): Observable<ITransaction>;
  deleteTransaction(
    transactionId: ITransaction['id']
  ): Observable<ITransaction>;
  deleteTransactions(
    transactionIds: ITransaction['id'][]
  ): Observable<ITransaction[]>;
  deleteAllTransactions(): Observable<ITransaction[]>;
  deleteAllTransactionsExcept(
    transactionIds: ITransaction['id'][]
  ): Observable<ITransaction[]>;
  getCustomerTransactions(
    customerId: ICustomer['id'],
    options?: QueryOptions<ITransaction>
  ): Observable<Maybe<Transaction[]>>;
  getCustomerTransactionCountsByCategory(
    customerId: ICustomer['id'],
    options?: QueryOptions<ITransaction>
  ): Observable<{ [category: Category['name']]: number }>;
  getCustomerTopRecentProducts(
    customerId: ICustomer['id'],
    options?: QueryOptions<ITransaction>
  ): Observable<Product['title'][]>;
}
