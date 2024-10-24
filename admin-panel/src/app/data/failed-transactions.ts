import { QueryOptions } from '../../types/query-options';
import { TransactionStatus } from '../model/enum/transaction-status';
import { IFailedTransaction } from '../model/failed-transaction';
import { Transaction } from '../model/transaction';
import { ITransactionItem } from '../model/transaction-item';
import { TRANSACTION_ITEMS } from './transaction-items';
import { TRANSACTIONS } from './transactions';

function getDatesInRange(min: Date, max: Date): Date[] {
  const dateArray: Date[] = [];
  let currentDate = new Date(min);

  while (currentDate <= max) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

function removeDuplicatesUsingSet<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function fetchFailedTransactions(
  options: QueryOptions<IFailedTransaction>
) {
  const dateFilterValue = options.dateFilter;

  if (dateFilterValue) {
    const storeFilterValue =
      options.filters?.find((f) => f.field === 'store')?.value ?? [];

    const [startDateValue, endDateValue] = dateFilterValue.split('_');

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let count = 0;

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

    return getDatesInRange(startDate, endDate).map((date) => {
      const items = filteredTransactionItems;

      const itemsTotal = items
        .map((item) => item.quantity * item.product.price)
        .reduce((acc, total) => acc + total, 0);

      const transactions = removeDuplicatesUsingSet(
        items.map((item) => item.transaction)
      );

      const transactionTotal = transactions
        .map((transaction) => transaction.grossAmount)
        .reduce((acc, amount) => acc + amount, 0);

      const gratuity = transactions
        .map((transaction) => transaction.service)
        .reduce((acc, service) => acc + service, 0);

      count++;
      return {
        id: count,
        date,
        items: items.length,
        itemsTotal,
        transactions: transactions.length,
        transactionTotal,
        gratuity,
      } as IFailedTransaction;
    });
  }

  return [];
}
