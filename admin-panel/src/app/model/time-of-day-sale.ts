import { Store } from './store';

export interface ITimeOfDaySale {
  id: number;
  timeOfDay: string;
  orders: number;
  grossSales: number;
  store: Store;
}

export class TimeOfDaySale implements ITimeOfDaySale {
  id: number;
  timeOfDay: string;
  orders: number;
  grossSales: number;
  store: Store;

  constructor(
    id = 0,
    timeOfDay = '',
    orders = 0,
    grossSales = 0,
    store = new Store()
  ) {
    this.id = id;
    this.timeOfDay = timeOfDay;
    this.orders = orders;
    this.grossSales = grossSales;
    this.store = store;
  }
}
