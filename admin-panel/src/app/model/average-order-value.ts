import { Store } from './store';

export interface IAverageOrderValue {
  id: number;
  date: Date;
  grossSales: number;
  orders: number;
  averageOrderValue: number;
  store: Store;
}

export class AverageOrderValue implements IAverageOrderValue {
  id: number;
  date: Date;
  grossSales: number;
  orders: number;
  averageOrderValue: number;
  store: Store;

  constructor(
    id = 0,
    date = new Date(),
    grossSales = 0,
    orders = 0,
    averageOrderValue = 0,
    store = new Store()
  ) {
    this.id = id;
    this.date = date;
    this.grossSales = grossSales;
    this.orders = orders;
    this.averageOrderValue = averageOrderValue;
    this.store = store;
  }
}
