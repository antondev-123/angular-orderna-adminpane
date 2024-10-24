import { QueryOptions } from '../../types/query-options';
import { ISaleDiscountSummary } from '../model/discount-summary';
import { Transaction } from '../model/transaction';
import { ITransactionItem } from '../model/transaction-item';
import { DISCOUNTS } from './discounts';
import { TRANSACTION_ITEMS } from './transaction-items';
import { TRANSACTIONS } from './transactions';

export function fetchDiscountSummaries(
  options: QueryOptions<ISaleDiscountSummary>
) {
  const dateFilterValue = options.dateFilter;

  if (dateFilterValue) {
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

    const summaries = DISCOUNTS.map((discount) => {
      const transactions = filteredTransactionItems;

      const redeems = transactions.filter((item) => !item.wasRefunded);

      const redeemAmount = redeems
        .map((redeem) => redeem.quantity * redeem.product.price)
        .reduce((acc, amount) => acc + amount, 0);

      count++;
      return {
        id: count,
        discount,
        usageCount: transactions.length,
        totalRedeemed: redeems.length,
        averageOrderValue:
          redeems.length > 0
            ? Number(Math.round(redeemAmount / redeems.length))
            : 0,
      } as ISaleDiscountSummary;
    });

    return summaries;
  }

  return [];
}
