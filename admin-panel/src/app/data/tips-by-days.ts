import { QueryOptions } from '../../types/query-options';
import { ITipsByDay } from '../model/tips-by-day';
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

export function fetchTipsByDays(options: QueryOptions<ITipsByDay>) {
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
    const tips = getDatesInRange(startDate, endDate).map((date) => {
      const transactions = TRANSACTIONS.filter(
        (transaction) =>
          transaction.transactionDate.toLocaleDateString() ===
            date.toLocaleDateString() &&
          storeFilterValue.includes(`${transaction.store.id}`)
      );

      const tips = transactions
        .map((transaction) => transaction.tip)
        .reduce((acc: number, tip) => acc + (tip ?? 0), 0);

      count++;
      return { id: count, date, tips } as ITipsByDay;
    });

    return tips;
  }

  return [];
}
