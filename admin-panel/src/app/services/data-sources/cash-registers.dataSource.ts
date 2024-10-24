import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ICashRegister } from '../../model/cash-register';
import { CashRegistersApiService } from '../cash-registers-analytics/cash-registers/cash-registers-api.service';

@Injectable()
export class CashRegistersDataSource extends DataSource<ICashRegister> {
  cashRegisters$ = new BehaviorSubject<ICashRegister[]>([]);
  totalCashRegisters$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private cashRegistersSubscription: Maybe<Subscription>;
  private totalCashRegistersSubscription: Maybe<Subscription>;

  constructor(private cashRegistersService: CashRegistersApiService) {
    super();
  }

  connect(): Observable<ICashRegister[]> {
    return this.cashRegisters$.asObservable();
  }

  disconnect(): void {
    this.cashRegisters$.complete();
    this.totalCashRegisters$.complete();
    this.isLoading$.complete();
    this.cashRegistersSubscription?.unsubscribe();
    this.totalCashRegistersSubscription?.unsubscribe();
  }

  loadTotalCashRegisters(): void {
    this.totalCashRegistersSubscription?.unsubscribe();
    this.totalCashRegistersSubscription = this.cashRegistersService
      .getTotalRegisterClosures()
      .subscribe((totalCashRegisters) => {
        this.totalCashRegisters$.next(totalCashRegisters ?? 0);
      });
  }

  loadCashRegisters(options: QueryOptions<ICashRegister>): void {
    this.isLoading$.next(true);
    this.cashRegistersSubscription?.unsubscribe();
    this.cashRegistersSubscription = this.cashRegistersService
      .getRegisterClosures(options)
      .subscribe((cashRegisters) => {
        console.log('loadCashRegisters', cashRegisters);
        this.isLoading$.next(false);
        this.cashRegisters$.next(cashRegisters ?? []);
      });
  }
}
