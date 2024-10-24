import { QueryOptions } from '../../types/query-options';
import { getRandomItem } from '../../utils/dummy-data';
import { IRefundedTransaction } from '../model/refunded-transaction';
import { ITransaction, Transaction } from '../model/transaction';
import { ITransactionItem, TransactionItem } from '../model/transaction-item';
import { TRANSACTION_ITEMS } from './transaction-items';
import { TRANSACTIONS } from './transactions';

const reasons = [
  'Undelivered Item',
  'Damaged or Defective Product',
  'Incorrect Order',
  'Unsatisfactory Service or Product',
];

export function fetchRefundedTransactions(
  options: QueryOptions<IRefundedTransaction>
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

    const items = TRANSACTION_ITEMS.reduce(
      (acc: (ITransactionItem & { transaction: Transaction })[], item) => {
        if (
          filteredTransactionIds.includes(item.transactionId) &&
          item.wasRefunded
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

    let count = 0;
    return items.map((item) => {
      count++;
      return {
        id: count,
        customer: item.transaction.customer,
        transactionNumber: item.transactionId,
        transactionDate: item.transaction.transactionDate,
        transactionTotal: item.quantity * item.product.price,
        refund: item.quantity * item.product.price,
        reason: getRandomItem(reasons),
      } as IRefundedTransaction;
    });
  }

  return [];
}
