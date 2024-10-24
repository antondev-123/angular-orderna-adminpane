import { Store } from './store';

export interface IRevenue {
  id: number;
  date: Date;
  orders: number;
  grossSales: number;
  discounts: number;
  store: Store;
}

export class Revenue implements IRevenue {
  id: number;
  date: Date;
  orders: number;
  grossSales: number;
  discounts: number;
  store: Store;

  constructor(
    id = 0,
    date = new Date(),
    orders = 0,
    grossSales = 0,
    discounts = 0,
    store = new Store()
  ) {
    this.id = id;
    this.date = date;
    this.orders = orders;
    this.grossSales = grossSales;
    this.discounts = discounts;
    this.store = store;
  }
}
