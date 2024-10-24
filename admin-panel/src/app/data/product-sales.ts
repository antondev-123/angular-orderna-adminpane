import { QueryOptions } from '../../types/query-options';
import { IProductSale } from '../model/product-sale';
import { Transaction } from '../model/transaction';
import { ITransactionItem } from '../model/transaction-item';
import { PRODUCTS } from './products';
import { TRANSACTION_ITEMS } from './transaction-items';
import { TRANSACTIONS } from './transactions';

export function fetchProductSales(options: QueryOptions<IProductSale>) {
  const dateFilterValue = options.dateFilter;

  if (dateFilterValue) {
    const [startDateValue, endDateValue] = dateFilterValue.split('_');

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const storeFilter = options.filters?.find((f) => f.field === 'store');

    const filteredTransactions = TRANSACTIONS.filter(
      (t) =>
        // Filter transactions within 'startDate' to 'endDate'
        t.transactionDate >= startDate &&
        t.transactionDate <= endDate &&
        // Filter transactions by store
        !!storeFilter &&
        storeFilter?.value.includes(`${t.store.id}`)
    );
    const filteredTransactionIds = filteredTransactions.map((t) => t.id);

    const filteredTransactionItems = TRANSACTION_ITEMS.reduce(
      (acc: (ITransactionItem & { transaction: Transaction })[], item) => {
        if (filteredTransactionIds.includes(item.transactionId)) {
          const transaction = filteredTransactions.find(
            (t) => t.id === item.transactionId
          )!;
          acc.push({ ...item, transaction });
        }
        return acc;
      },
      []
    );

    let count = 0;
    const products = PRODUCTS.map((product) => {
      const items = filteredTransactionItems.filter(
        (item) => item.product.id === product.id
      );

      const revenue = items
        .map((item) => item.quantity * item.product.price)
        .reduce((acc, item) => acc + item, 0);

      count++;
      return {
        id: count,
        product,
        revenue,
        orders: items.length,
      } as IProductSale;
    });

    return products;
  }

  return [];
}
