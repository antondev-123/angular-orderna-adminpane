import { Injectable } from '@angular/core';
import { CASH_DRAWER } from '../../data/cash-drawer';
import { CashDrawer } from '../../model/cash-drawer';
import { Observable, of } from 'rxjs';
import {
  getRandomBoolean,
  getRandomNumber,
} from '@orderna/admin-panel/src/utils/dummy-data';
import { ICashDrawersApiService } from './cash-drawers-api.interface';

@Injectable({
  providedIn: 'root',
})
export class CashDrawersMockApiService implements ICashDrawersApiService {
  public cashDrawer: CashDrawer;

  constructor() {
    this.cashDrawer = CASH_DRAWER;
  }

  public getLastCashDrawer(): Observable<CashDrawer> {
    const cashMovementsTotal = this.getCashMovementsTotal();
    const expectedCash = this.getExpectedCash(cashMovementsTotal);
    const countedCash = this.getCountedCash(expectedCash);
    const expectedVsCountedCashDifference =
      this.getExpectedVsCountedCashDifference(expectedCash, countedCash);
    const closingCash = this.getClosingCash();
    const cashToBank = this.getCashToBank(countedCash, closingCash);

    return of({
      ...this.cashDrawer,

      // Add other computed values below
      expectedCash,
      countedCash,
      expectedVsCountedCashDifference,
      closingCash,
      cashToBank,
    });
  }

  private getExpectedCash(cashMovementsTotal: number) {
    return cashMovementsTotal + this.cashDrawer.cashPaymentsReceived;
  }

  private getCountedCash(expectedCash: number) {
    // Simulate difference between expected and counted cash
    const randomDifference = getRandomBoolean() ? getRandomNumber(20, 1000) : 0;

    return Math.max(expectedCash - randomDifference, 0);
  }

  private getExpectedVsCountedCashDifference(
    expectedCash: number,
    countedCash: number
  ) {
    return countedCash - expectedCash;
  }

  private getCashMovementsTotal() {
    let val = 0;
    for (let i = 0; i < this.cashDrawer.cashManagement.length; i++) {
      if (this.cashDrawer.cashManagement[i].cashType === 'cashIn') {
        val += this.cashDrawer.cashManagement[i].amount;
      } else if (this.cashDrawer.cashManagement[i].cashType === 'cashOut') {
        val -= this.cashDrawer.cashManagement[i].amount;
      }
    }
    return val;
  }

  private getClosingCash() {
    // Sum of 'cash in' transactions in cash movements
    let val = 0;
    for (let i = 0; i < this.cashDrawer.cashManagement.length; i++) {
      if (this.cashDrawer.cashManagement[i].cashType === 'cashIn') {
        val += this.cashDrawer.cashManagement[i].amount;
      }
    }
    return val;
  }

  private getCashToBank(countedCash: number, closingCash: number) {
    return Math.max(countedCash - closingCash, 0);
  }
}
