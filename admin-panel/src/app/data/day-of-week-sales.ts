import { Maybe } from '../../types/maybe';
import { QueryOptions } from '../../types/query-options';
import { IDayOfWeekSale } from '../model/day-of-week-sale';
import { Days, getToday } from '../model/enum/day';
import { TRANSACTIONS } from './transactions';

export function fetchDayOfWeekSales(options: QueryOptions<IDayOfWeekSale>) {
  const dateFilterValue = options.dateFilter;

  if (dateFilterValue) {
    const [startDateValue, endDateValue] = dateFilterValue.split('_');

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const storeFilterValue =
      options.filters?.find((f) => f.field === 'store')?.value ?? [];

    const days = Object.values(Days).filter((v) => !isNaN(Number(v)));
    const keys = Object.keys(Days).filter((v) => isNaN(Number(v)));

    let count = 0;
    const sales = days.map((day) => {
      let currentDay = keys[+day];

      const transactions = TRANSACTIONS.filter(
        (transaction) =>
          transaction.transactionDate >= startDate &&
          transaction.transactionDate <= endDate &&
          storeFilterValue.includes(`${transaction.store.id}`) &&
          getToday(Days, transaction.transactionDate.getDay()).toString() ===
            currentDay
      );

      const grossSales = transactions
        .map((transaction) => transaction.grossAmount)
        .reduce((acc, grossAmount) => acc + grossAmount, 0);

      count++;
      return {
        id: count,
        dayOfWeek: keys[+day],
        grossSales,
        orders: transactions.length,
      } as IDayOfWeekSale;
    });

    console.log(sales);
    return sales;
  }

  return [];
}
