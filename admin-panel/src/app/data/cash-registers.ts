import {
  getRandomBoolean,
  getRandomDate,
  getRandomDateInRange,
  getRandomNumber,
} from '../../utils/dummy-data';
import { ICashRegister } from '../model/cash-register';
import { STORES } from './stores';

function getRandomDates(count: number, start: Date, end: Date): Date[] {
  const randomDates: Date[] = [];
  for (let i = 0; i < count; i++) {
    randomDates.push(getRandomDateInRange(start, end));
  }
  return randomDates;
}

let count = 0;
export const CASH_REGISTERS: ICashRegister[] = STORES.reduce(
  (acc: ICashRegister[], store) => {
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date();
    const dates = getRandomDates(20, startDate, endDate);

    dates.map((date) => {
      const opened: Date = new Date(date.setHours(1, 0, 0, 0));
      const closed: Date = new Date(date.setHours(17, 0, 0, 0));

      count++;
      acc.push({
        id: count,
        cashManagement: {
          id: count,
          cashStart: getRandomNumber(100, 1000),
          cashEnd: getRandomNumber(100, 3000),
          cashIn: getRandomNumber(100, 2000),
          cashOut: getRandomNumber(100, 3000),
          isExpense: getRandomBoolean(),
          note: '',
        },
        closed,
        opened,
        counted: count,
        store,
        title: `${store.name} - Main Register`,
        note: '',
      } as ICashRegister);
    });

    return acc;
  },
  []
);
