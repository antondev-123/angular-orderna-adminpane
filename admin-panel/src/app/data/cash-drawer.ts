import { getRandomNumber } from '../../utils/dummy-data';
import { CashDrawer } from '../model/cash-drawer';

const currentDate = new Date();
export const CASH_DRAWER: CashDrawer = {
  id: 1,
  outlet: 'Main Outlet',
  register: 'Main Register',
  closure: '4',
  openingTime: new Date(),
  closingTime: new Date(),

  cashManagement: [
    {
      id: 1,
      amount: getRandomNumber(2000, 5000, 10),
      time: new Date(currentDate.setHours(9)),
      expenseName: '',
      note: 'Starting Cash',
      cashType: 'cashIn',
      user: 'Dillie Tellesson',
    },
    {
      id: 2,
      amount: 50,
      time: new Date(currentDate.setHours(10)),
      expenseName: '',
      note: 'Coffee',
      cashType: 'cashOut',
      user: 'Dillie Tellesson',
    },
    {
      id: 3,
      amount: 20,
      time: new Date(currentDate.setHours(11)),
      expenseName: '',
      note: 'Courier Payment',
      cashType: 'cashOut',
      user: 'Dillie Tellesson',
    },
  ],
  cashPaymentsReceived: getRandomNumber(5000, 20000),

  // Computed in cash service
  countedCash: 0,
  expectedCash: 0,
  expectedVsCountedCashDifference: 0,
  closingCash: 0,
  cashToBank: 0,

  gCashPayment: 200,
  storeCredit: 2300,
};
