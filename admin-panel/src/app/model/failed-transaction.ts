export interface IFailedTransaction {
  id: number;
  date: Date;
  items: number;
  itemsTotal: number;
  transactions: number;
  transactionTotal: number;
  gratuity: number;
}

export class FailedTransaction implements IFailedTransaction {
  id: number;
  date: Date;
  items: number;
  itemsTotal: number;
  transactions: number;
  transactionTotal: number;
  gratuity: number;

  constructor(
    id = 0,
    date = new Date(),
    items = 0,
    itemsTotal = 0,
    transactions = 0,
    transactionTotal = 0,
    gratuity = 0
  ) {
    this.id = id;
    this.date = date;
    this.items = items;
    this.itemsTotal = itemsTotal;
    this.transactions = transactions;
    this.transactionTotal = transactionTotal;
    this.gratuity = gratuity;
  }
}
