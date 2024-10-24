import { CashManagement, ICashManagement } from './cash-management';
import { Store } from './store';

export interface ICashRegister {
  id: number;
  cashManagement: ICashManagement;
  title: string;
  opened: Date;
  closed: Date;
  counted: number;
  note: string;
  store: Store;
}

export class CashRegister implements ICashRegister {
  id: number;
  cashManagement: ICashManagement;
  title: string;
  opened: Date;
  closed: Date;
  counted: number;
  note: string;
  store: Store;

  constructor(
    id = 0,
    cashManagement = new CashManagement(),
    title = '',
    opened = new Date(),
    closed = new Date(),
    counted = 0,
    note = '',
    store = new Store()
  ) {
    this.id = id;
    this.cashManagement = cashManagement;
    this.title = title;
    this.opened = opened;
    this.closed = closed;
    this.counted = counted;
    this.note = note;
    this.store = store;
  }
}
