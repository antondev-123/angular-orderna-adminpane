import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { ITransactionsApiService } from './transactions-api.interface';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
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
import { TRANSACTIONS } from '../../data/transactions';
import { Customer, CustomerStatistics, ICustomer } from '../../model/customer';
import { CurrencyCode } from '../../model/enum/currency-code';
import { DiscountType } from '../../model/enum/discount-type';
import { TransactionStatus } from '../../model/enum/transaction-status';
import {
  ITransaction,
  Transaction,
  ITransactionDerivedValues,
  TransactionCreateData,
  TransactionUpdateData,
} from '../../model/transaction';
import {
  TransactionItem,
  ITransactionItemDerivedValues,
  TransactionItemUpdateData,
  TransactionItemCreateData,
} from '../../model/transaction-item';
import { TRANSACTION_ITEMS } from '../../data/transaction-items';
import { v4 as uuidv4 } from 'uuid';
import { CATEGORIES } from '../../data/stores';
import { Category } from '../../model/category';
import { Product } from '../../model/product';
import { ProductsApiService } from '../products/products-api.service';
import { DiscountsApiService } from '../discounts/discounts-api.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsMockApiService implements ITransactionsApiService {
  productsService = inject(ProductsApiService);
  discountsService = inject(DiscountsApiService);

  private transactionItems: TransactionItem[] = [...TRANSACTION_ITEMS];

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

  getTotalTransactions(): Observable<Maybe<number>> {
    return getTotalItems(this.transactionsData);
  }

  getTransaction(
    transactionId: ITransaction['id']
  ): Observable<Maybe<Transaction>> {
    return getItem(this.transactionsData, transactionId).pipe(
      map((transaction) =>
        transaction
          ? this.addStatisticsToTransactionCustomer(transaction)
          : null
      )
    );
  }

  getTransactions(
    options: QueryOptions<ITransaction>
  ): Observable<Maybe<{ count: number; data: Transaction[] }>> {
    const andFilterByStore = (item: ITransaction) => {
      const storeFilter = options.filters?.find((f) => f.field === 'store');
      if (!storeFilter) return true;

      return this.transactionsData.items.some(
        (t) => t.store.id === item.store.id && t.store.id === +storeFilter.value
      );
    };

    this.extendTransactionData();

    const transactions$ = filterItems(
      this.transactionsData,
      options,
      andFilterByStore
    );

    const totalTransactionsAfterFilter$ =
      this.transactionsData.totalAfterFilterSubject.asObservable();
    return combineLatest([transactions$, totalTransactionsAfterFilter$]).pipe(
      map(([transactions, totalTransactionsAfterFilter]) => ({
        count: totalTransactionsAfterFilter ?? 0,
        data: transactions ?? [],
      }))
    );
  }

  private extendTransactionData() {
    const transactions: Transaction[] = [];

    for (const transaction of this.transactionsData.items) {
      transactions.push(
        this.addDerivedValuesToTransaction(
          this.addItemsToTransaction(transaction)
        )
      );
    }

    this.transactionsData.items = [...transactions];
  }

  private addStatisticsToTransactionCustomer(
    transaction: Transaction
  ): Transaction {
    const customer = this.addTransactionStatisticsToCustomer(
      transaction.customer
    );
    return Transaction.fromJSON({
      ...transaction,
      customer,
    });
  }

  private addItemsToTransaction(transaction: Transaction): Transaction {
    const items = this.getTransactionItems(transaction.id);
    return Transaction.fromJSON({
      ...transaction,
      items,
      itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
    });
  }

  private getTransactionItems(transactionId: Transaction['id']) {
    return this.transactionItems
      .filter((item) => item.transactionId === transactionId)
      .map((item) => this.addDerivedValuesToTransactionItem(item));
  }

  private addDerivedValuesToTransactionItem(
    item: TransactionItem
  ): TransactionItem {
    const salePrice = item.unitPrice * item.quantity;

    const discountAmount = item.discount
      ? item.discount.type === DiscountType.PERCENTAGE
        ? salePrice * item.discount.value
        : item.discount.value
      : 0;

    const refundAmount = item.wasRefunded ? salePrice - discountAmount : 0;

    const netSales = salePrice - refundAmount - discountAmount;

    const derivedValues: ITransactionItemDerivedValues = {
      salePrice,
      refundAmount,
      discountAmount,
      netSales,
    };

    return TransactionItem.fromJSON({
      ...item,
      ...derivedValues,
    });
  }

  private addDerivedValuesToTransaction(transaction: Transaction): Transaction {
    const salePrice = transaction.items.reduce(
      (acc, item) => acc + item.salePrice,
      0
    );

    const refundAmount = transaction.items.reduce(
      (acc, item) => acc + item.refundAmount,
      0
    );

    const totalItemLevelDiscount = transaction.items.reduce(
      (acc, item) => acc + item.discountAmount,
      0
    );
    const transactionLevelDiscount = transaction.discount
      ? transaction.discount.type === DiscountType.PERCENTAGE
        ? salePrice * transaction.discount.value
        : transaction.discount.value
      : 0;
    const discountAmount = totalItemLevelDiscount + transactionLevelDiscount;

    const netSales = salePrice - refundAmount - discountAmount;

    const taxAmount = netSales * transaction.salesTaxRate;

    const serviceAmount = transaction.serviceChargeRate
      ? netSales * transaction.serviceChargeRate
      : 0;

    const grossSales = netSales + taxAmount + serviceAmount;

    const derivedValues: ITransactionDerivedValues = {
      salePrice,
      refundAmount,
      discountAmount,
      netSales,
      taxAmount,
      serviceAmount,
      grossSales,
    };

    return Transaction.fromJSON({
      ...transaction,
      ...derivedValues,
    });
  }

  createTransaction(transaction: TransactionCreateData): Observable<any> {
    const id = uuidv4();

    this.createTransactionItems(id, transaction.items);
    const newTransaction = this.addDerivedValuesToTransaction(
      this.addItemsToTransaction(
        Transaction.fromJSON({
          ...transaction,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [],
          total: 0,
          itemCount: 0,
          revenue: 0,
          tax: 0,
          service: 0,
          refund: 0,
          grossAmount: 0,
          costOfGoods: 0,
          salePrice: 0,
          refundAmount: 0,
          discountAmount: 0,
          netSales: 0,
          taxAmount: 0,
          serviceAmount: 0,
          grossSales: 0,
        })
      )
    );
    return createItem(this.transactionsData, newTransaction);
  }

  updateTransaction(transaction: TransactionUpdateData): Observable<any> {
    this.updateTransactionItems(transaction.id, transaction.items);

    const currentTransaction = this.transactionsData.items.find(
      (t) => t.id === transaction.id
    );

    if (!currentTransaction) {
      throw new Error(`No transaction with ID ${transaction.id} found.`);
    }

    const newTransaction = this.addDerivedValuesToTransaction(
      this.addItemsToTransaction(
        Transaction.fromJSON({
          ...transaction,
          transactionDate:
            transaction.transactionDate ?? currentTransaction.transactionDate,
          customer:
            transaction.customer !== undefined
              ? transaction.customer
              : currentTransaction.customer,
          status: transaction.status ?? currentTransaction.status,
          transactionType:
            transaction.transactionType ?? currentTransaction.transactionType,
          store: transaction.store ?? currentTransaction.store,
          discount:
            transaction.discount !== undefined
              ? transaction.discount
              : currentTransaction.discount,
          user: transaction.user ?? currentTransaction.user,
          salesTaxRate:
            transaction.salesTaxRate ?? currentTransaction.salesTaxRate,
          serviceChargeRate:
            transaction.serviceChargeRate !== undefined
              ? transaction.serviceChargeRate
              : currentTransaction.serviceChargeRate,
          paymentType:
            transaction.paymentType ?? currentTransaction.paymentType,
          tip: transaction.tip ?? currentTransaction.tip,
          note: transaction.note ?? currentTransaction.note,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [],
          total: 0,
          itemCount: 0,
          revenue: 0,
          tax: 0,
          service: 0,
          refund: 0,
          grossAmount: 0,
          costOfGoods: 0,
          salePrice: 0,
          refundAmount: 0,
          discountAmount: 0,
          netSales: 0,
          taxAmount: 0,
          serviceAmount: 0,
          grossSales: 0,
        })
      )
    );
    return updateItem(this.transactionsData, newTransaction);
  }

  updateTransactionItems(
    transactionId: Transaction['id'],
    items: TransactionItemUpdateData[] = []
  ) {
    const transactionItems = this.getTransactionItems(transactionId);

    const currentTransactionItemIds = transactionItems.map((i) => i.id);
    const updatedTransactionItemIds = items.map((i) => i.id);

    const transactionItemIdsToDelete = currentTransactionItemIds.filter(
      (id) => !updatedTransactionItemIds.includes(id)
    );
    const transactionItemsToCreate = items.filter(
      (i) => !currentTransactionItemIds.includes(i.id)
    );
    const transactionItemsToUpdate = transactionItems.filter((i) =>
      updatedTransactionItemIds.includes(i.id)
    );

    this.deleteTransactionItems(transactionItemIdsToDelete);

    this.createTransactionItems(
      transactionId,
      transactionItemsToCreate as TransactionItemCreateData[]
    );

    for (const item of transactionItemsToUpdate) {
      const updatedTransactionItemData = items.find((i) => i.id === item.id);

      if (updatedTransactionItemData === undefined) {
        throw new Error(`No transaction item with ID ${item.id} found.`);
      }

      const product = this.productsService.productsData.items.find(
        (p) => p.id === updatedTransactionItemData.productId
      );
      const discount = item.discountId
        ? this.discountsService.discountsData.items.find(
            (p) => p.id === updatedTransactionItemData.discountId
          )
        : null;

      if (product === undefined) {
        throw new Error(`No product with ID ${item.productId} found.`);
      }

      if (discount === undefined) {
        throw new Error(`No discount with ID ${item.discountId} found.`);
      }

      const updatedTransactionItem = TransactionItem.fromJSON({
        ...item,
        ...(updatedTransactionItemData.quantity && {
          quantity: updatedTransactionItemData.quantity,
        }),
        ...(updatedTransactionItemData.productId && {
          productId: updatedTransactionItemData.productId,
          product,
        }),
        ...(updatedTransactionItemData.productId && {
          productId: updatedTransactionItemData.productId,
          product,
        }),
        ...(typeof updatedTransactionItemData.wasRefunded === 'boolean' && {
          wasRefunded: updatedTransactionItemData.wasRefunded,
        }),
        ...(updatedTransactionItemData.note && {
          note: updatedTransactionItemData.note,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
        transactionId,
        salePrice: 0,
        refundAmount: 0,
        discountAmount: 0,
        netSales: 0,
      });

      this.transactionItems.splice(
        this.transactionItems.findIndex((i) => i.id === item.id),
        1
      );
      this.transactionItems.push(updatedTransactionItem);
    }
  }

  deleteTransactionItems(ids: TransactionItem['id'][]) {
    for (const id of ids) {
      const index = this.transactionItems.findIndex((i) => i.id === id);
      if (index !== -1) {
        this.transactionItems.splice(index, 1);
      }
    }
  }

  createTransactionItems(
    transactionId: Transaction['id'],
    items: TransactionItemCreateData[]
  ) {
    if (!items || items.length === 0) return;
    for (const item of items) {
      const product = this.productsService.productsData.items.find(
        (p) => p.id === item.productId
      );
      const discount = item.discountId
        ? this.discountsService.discountsData.items.find(
            (p) => p.id === item.discountId
          )
        : null;

      if (product === undefined) {
        throw new Error(`No product with ID ${item.productId} found.`);
      }

      if (discount === undefined) {
        throw new Error(`No discount with ID ${item.discountId} found.`);
      }

      this.transactionItems.push(
        TransactionItem.fromJSON({
          ...item,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
          transactionId,
          product,
          discount,
          salePrice: 0,
          refundAmount: 0,
          discountAmount: 0,
          netSales: 0,
        })
      );
    }
    console.log(
      `Created ${items.length} transaction items for ${transactionId}`
    );
  }

  deleteTransaction(
    transactionId: Transaction['id']
  ): Observable<ITransaction> {
    return deleteItem(this.transactionsData, transactionId);
  }

  deleteTransactions(
    transactionIds: Transaction['id'][]
  ): Observable<ITransaction[]> {
    return deleteItems(this.transactionsData, transactionIds);
  }

  deleteAllTransactions(): Observable<ITransaction[]> {
    return deleteAllItems(this.transactionsData);
  }

  deleteAllTransactionsExcept(
    transactionIds: Transaction['id'][]
  ): Observable<ITransaction[]> {
    return deleteAllItemsExcept(this.transactionsData, transactionIds);
  }

  addTransactionStatisticsToCustomer(
    customer: Maybe<Customer>
  ): Customer | null {
    if (!customer) return null;

    const customerTransactions = this.transactionsData.items
      .filter(
        (transaction) =>
          transaction.customer !== null &&
          transaction.customer.id === customer.id
      )
      .map((t) =>
        this.addDerivedValuesToTransaction(this.addItemsToTransaction(t))
      );
    const customerTransactionsStatistics =
      this.computeCustomerTransactionsStatistics(customerTransactions);

    return Customer.fromJSON({
      ...customer,
      ...customerTransactionsStatistics,
    });
  }

  private computeCustomerTransactionsStatistics(
    transactions: Maybe<Transaction[]>
  ) {
    if (!transactions) {
      return new CustomerStatistics(0, 0, 0, null, '', 0, CurrencyCode.PHP);
    }

    const totalTransactions = transactions.length;
    const totalRefunds = transactions.reduce((acc, transaction) => {
      if (transaction.status === TransactionStatus.REFUNDED) {
        return acc + 1;
      }
      return acc;
    }, 0);
    const totalAmountSpent = transactions.reduce((sum, transaction) => {
      if (
        [TransactionStatus.REFUNDED, TransactionStatus.FAIL].includes(
          transaction.status
        )
      ) {
        return sum - transaction.grossSales;
      }
      return sum + transaction.grossSales;
    }, 0);

    // Assuming getCustomerTransactions return transactions ordered by date
    const lastTransaction = transactions[0];
    // TODO: Refactor
    const lastTransactionDate =
      totalTransactions > 0 ? lastTransaction.transactionDate : null;
    const lastTransactionId = totalTransactions > 0 ? lastTransaction.id : '';

    const averageAmountSpent = totalTransactions
      ? totalAmountSpent / totalTransactions
      : 0;

    return new CustomerStatistics(
      totalTransactions,
      totalRefunds,
      totalAmountSpent,
      lastTransactionDate,
      lastTransactionId,
      averageAmountSpent
    );
  }

  getCustomerTransactions(
    customerId: ICustomer['id'],
    options?: QueryOptions<ITransaction>
  ): Observable<Maybe<Transaction[]>> {
    const andFilterByCustomerId = (item: ITransaction) => {
      return item.user.id === customerId;
    };
    return filterItems(this.transactionsData, options, andFilterByCustomerId);
  }
  getCustomerTransactionCountsByCategory(
    customerId: ICustomer['id'],
    options?: QueryOptions<ITransaction>
  ): Observable<{ [category: Category['name']]: number }> {
    this.extendTransactionData();
    return this.getCustomerTransactions(customerId, options).pipe(
      map((transactions) => {
        if (!transactions) return {};

        return transactions.reduce(
          (acc: { [category: Category['name']]: number }, transaction) => {
            for (const item of transaction.items) {
              const categoryId = item.product.category;
              const categoryName =
                CATEGORIES.find((c) => c.id === categoryId)?.name ?? 'Unknown';
              if (acc[categoryName] !== undefined) {
                acc[categoryName]++;
              } else {
                acc[categoryName] = 1;
              }
            }
            return acc;
          },
          {}
        );
      })
    );
  }

  getCustomerTopRecentProducts(
    customerId: ICustomer['id'],
    options?: QueryOptions<ITransaction>
  ): Observable<Product['title'][]> {
    this.extendTransactionData();
    return this.getCustomerTransactions(customerId, options).pipe(
      // Count how many times customer bought a product
      map((transactions) => {
        if (!transactions) return [];

        return transactions.reduce(
          (acc: { [productName: string]: number }, transaction) => {
            for (const item of transaction.items) {
              const productName = item.product.title;
              if (acc[productName] !== undefined) {
                acc[productName]++;
              } else {
                acc[productName] = 1;
              }
            }
            return acc;
          },
          {}
        );
      }),
      // Get Top 10 products
      map((productPurchaseCount) => {
        // Convert object to array of key-value pairs
        let productPurchaseCountArray = Object.entries(productPurchaseCount);

        // Sort array based on values (number of purchases), in descending order
        productPurchaseCountArray.sort((a, b) => b[1] - a[1]);

        return productPurchaseCountArray.slice(0, 10).map((item) => item[0]);
      })
    );
  }
}
