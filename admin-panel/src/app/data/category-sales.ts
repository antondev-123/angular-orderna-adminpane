import { QueryOptions } from '../../types/query-options';
import { ICategorySale } from '../model/category-sale';
import { Transaction } from '../model/transaction';
import { ITransactionItem } from '../model/transaction-item';
import { CATEGORIES } from './stores';
import { TRANSACTION_ITEMS } from './transaction-items';
import { TRANSACTIONS } from './transactions';

export function fetchCategorySales(options: QueryOptions<ICategorySale>) {
  const dateFilterValue = options.dateFilter;

  if (dateFilterValue) {
    const [startDateValue, endDateValue] = dateFilterValue.split('_');

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const storeFilterValue =
      options.filters?.find((f) => f.field === 'store')?.value ?? [];

    let count = 0;
    const categories = CATEGORIES.map((category) => {
      const products = category.products.map((product) => product.id);

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

      const items = TRANSACTION_ITEMS.reduce(
        (acc: (ITransactionItem & { transaction: Transaction })[], item) => {
          if (
            filteredTransactionIds.includes(item.transactionId) &&
            products.includes(item.product.id)
          ) {
            const transaction = filteredTransactions.find(
              (t) => t.id === item.transactionId
            )!;
            acc.push({ ...item, transaction });
          }
          return acc;
        },
        []
      );

      const unitsSold = items
        .map((item) => item.quantity)
        .reduce((acc, qty) => acc + qty, 0);

      const revenue = items
        .map((item) => item.quantity * item.product.price)
        .reduce((acc, gross) => acc + gross, 0);

      count++;
      return {
        id: count,
        category,
        unitsSold,
        revenue,
      } as ICategorySale;
    });

    return categories;
  }

  return [];
}
