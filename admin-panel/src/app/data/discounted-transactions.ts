import { QueryOptions } from '../../types/query-options';
import { IDiscountedTransaction } from '../model/discounted-transaction';
import { Transaction } from '../model/transaction';
import { ITransactionItem } from '../model/transaction-item';
import { TRANSACTION_ITEMS } from './transaction-items';
import { TRANSACTIONS } from './transactions';

export function fetchDiscountedTransactions(
  options: QueryOptions<IDiscountedTransaction>
) {
  const dateFilterValue = options.dateFilter;

  if (dateFilterValue) {
    const [startDateValue, endDateValue] = dateFilterValue.split('_');

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    startDate.setHours(0, 0, 0, 0);

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
    const transactions = filteredTransactionItems.map((item) => {
      count++;
      return {
        id: count,
        transactionDate: item.transaction.transactionDate,
        code: item.transaction.discount?.code,
        customer: item.transaction.customer,
        discountAmount: item.discountAmount,
        transactionNumber: item.transaction.id,
        transactionTotal: item.quantity * item.product.price,
        type: item.transaction.transactionType,
      } as IDiscountedTransaction;
    });

    return transactions;
  }
  return [];
}
