import { Maybe } from '../../types/maybe';
import { QueryOptions } from '../../types/query-options';
import { ITimeOfDaySale } from '../model/time-of-day-sale';
import { TRANSACTIONS } from './transactions';

function generate12HourClockArray(): string[] {
  const times: string[] = [];

  for (let hour = 0; hour < 24; hour++) {
    times.push(getTimeString(hour));
  }

  return times;
}

function getTimeString(hour: number) {
  const isAM = hour < 12;
  const displayHour = hour % 12 || 12; // Convert 0 to 12

  const timeString = `${displayHour.toString().padStart(2, '0')}:${
    isAM ? '00' : '00'
  } ${isAM ? 'AM' : 'PM'}`;

  return timeString;
}

export function fecthTimeOfDaySales(options: QueryOptions<ITimeOfDaySale>) {
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
    const sales = generate12HourClockArray().map((timeOfDay) => {
      const transactions = TRANSACTIONS.filter(
        (transaction) =>
          transaction.transactionDate >= startDate &&
          transaction.transactionDate <= endDate &&
          storeFilterValue.includes(`${transaction.store.id}`) &&
          transaction.transactionDate.getHours() === count
      );

      const grossSales = transactions
        .map((transaction) => transaction.grossAmount)
        .reduce((acc, grossAmount) => acc + grossAmount, 0);

      count++;
      return {
        id: count,
        timeOfDay,
        grossSales,
        orders: transactions.length,
      } as ITimeOfDaySale;
    });

    return sales;
  }

  return [];
}
