import { Store } from './store';

export interface IDayOfWeekSale {
  id: number;
  dayOfWeek: string;
  orders: number;
  grossSales: number;
  store: Store;
}

export class DayOfWeekSale implements IDayOfWeekSale {
  id: number;
  dayOfWeek: string;
  orders: number;
  grossSales: number;
  store: Store;

  constructor(
    id = 0,
    dayOfWeek = '',
    orders = 0,
    grossSales = 0,
    store = new Store()
  ) {
    this.id = id;
    this.dayOfWeek = dayOfWeek;
    this.orders = orders;
    this.grossSales = grossSales;
    this.store = store;
  }
}
