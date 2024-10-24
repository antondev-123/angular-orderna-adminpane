import { Maybe } from '../../types/maybe';
import { QueryOptions } from '../../types/query-options';
import { IRevenue } from '../model/revenue';
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

export function fetchRevenues(
  options: QueryOptions<IRevenue>
): Maybe<IRevenue[]> {
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

    const revenues = getDatesInRange(startDate, endDate).map((date) => {
      const transactions = TRANSACTIONS.filter(
        (transaction) =>
          transaction.transactionDate.toLocaleDateString() ===
            date.toLocaleDateString() &&
          storeFilterValue.includes(`${transaction.store.id}`)
      );

      const grossSales = transactions
        .map((transaction) => transaction.grossAmount)
        .reduce((acc, grossAmount) => acc + grossAmount, 0);

      const discounts = transactions
        .map((transaction) => transaction.discountAmount)
        .reduce((acc, discountAmount) => acc + discountAmount, 0);

      count++;
      return {
        id: count,
        date,
        orders: transactions.length,
        grossSales,
        discounts,
      } as IRevenue;
    });

    return revenues;
  }

  return [];
}
