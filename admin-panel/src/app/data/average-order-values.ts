import { Maybe } from '../../types/maybe';
import { QueryOptions } from '../../types/query-options';
import { IAverageOrderValue } from '../model/average-order-value';
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

export function fetchAverageOrderValues(
  options: QueryOptions<IAverageOrderValue>
): Maybe<IAverageOrderValue[]> {
  const storeFilterValue =
    options.filters?.find((f) => f.field === 'store')?.value ?? [];
  const dateFilterValue = options.dateFilter;

  if (dateFilterValue) {
    const [startDateValue, endDateValue] = dateFilterValue.split('_');

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let count = 0;
    const values = getDatesInRange(startDate, endDate).map((date) => {
      const transactions = TRANSACTIONS.filter(
        (transaction) =>
          transaction.transactionDate.toLocaleDateString() ===
            date.toLocaleDateString() &&
          storeFilterValue.includes(`${transaction.store.id}`)
      );

      const grossSales = transactions
        .map((t) => t.grossAmount)
        .reduce((acc, grossAmount) => acc + grossAmount, 0);

      const averageOrderValue =
        transactions.length > 0 ? grossSales / transactions.length : 0;

      count++;
      return {
        id: count,
        date,
        orders: transactions.length,
        grossSales,
        averageOrderValue,
      } as IAverageOrderValue;
    });

    return values;
  }

  return [];
}
