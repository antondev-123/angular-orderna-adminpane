export interface ICashManagement {
  id: number;
  cashStart: number;
  cashEnd: number;
  cashIn: number;
  cashOut: number;
  isExpense: boolean;
  note: string;
}

export class CashManagement implements ICashManagement {
  id: number;
  cashStart: number;
  cashEnd: number;
  cashIn: number;
  cashOut: number;
  isExpense: boolean;
  note: string;

  constructor(
    id = 0,
    cashStart = 0,
    cashEnd = 0,
    cashIn = 0,
    cashOut = 0,
    isExpense = false,
    note = ''
  ) {
    this.id = id;
    this.cashStart = cashStart;
    this.cashEnd = cashEnd;
    this.cashIn = cashIn;
    this.cashOut = cashOut;
    this.isExpense = isExpense;
    this.note = note;
  }
}
