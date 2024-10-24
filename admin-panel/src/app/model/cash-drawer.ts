export interface CashManagement {
  id?: number;
  amount: number;
  time: Date;
  expenseName?: string;
  note: string;
  cashType: 'cashIn' | 'cashOut';
  user: string;
}

export interface CashDrawer {
  id: number;
  outlet: string;
  register: string;
  closure: string;
  openingTime: Date;
  closingTime: Date;
  expectedCash: number;
  countedCash: number;
  expectedVsCountedCashDifference: number;
  cashManagement: CashManagement[];
  cashPaymentsReceived: number;
  closingCash: number;
  cashToBank: number;
  gCashPayment: number;
  storeCredit: number;
}
