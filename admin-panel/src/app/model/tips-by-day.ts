import { Store } from './store';

export interface ITipsByDay {
  id: number;
  date: Date;
  tips: number;
  store: Store;
}

export class TipsByDay implements ITipsByDay {
  id: number;
  date: Date;
  tips: number;
  store: Store;

  constructor(id = 0, date = new Date(), tips = 0, store = new Store()) {
    this.id = id;
    this.date = date;
    this.tips = tips;
    this.store = store;
  }
}
