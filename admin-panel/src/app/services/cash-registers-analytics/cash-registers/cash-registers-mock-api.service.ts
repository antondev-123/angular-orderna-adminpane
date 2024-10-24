import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getTotalItems,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICashRegistersApiService } from './cash-registers-api.interface';
import { CASH_REGISTERS } from '../../../data/cash-registers';
import { ICashRegister, CashRegister } from '../../../model/cash-register';

@Injectable({
  providedIn: 'root',
})
export class CashRegistersMockApiService implements ICashRegistersApiService {
  data = {
    cash_registers: {
      items: [...CASH_REGISTERS],
      queryOptions: {
        page: 1,
        perPage: 10,
      } as QueryOptions<ICashRegister>,
      subject: new BehaviorSubject<Maybe<CashRegister[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get cashRegistersData() {
    return this.data['cash_registers'] as Data<CashRegister, ICashRegister>;
  }

  getRegisterClosures(
    options: QueryOptions<ICashRegister>
  ): Observable<Maybe<ICashRegister[]>> {
    console.log(CASH_REGISTERS);

    const andFilterByStore = (item: ICashRegister) => {
      let result = true;
      if (options.filters?.find((f) => f.field === 'store')) {
        const storeFilter = options.filters?.find((f) => f.field === 'store');

        result = CASH_REGISTERS.some(
          (c) =>
            item.id === c.id &&
            !!storeFilter &&
            storeFilter?.value.includes(`${c.store.id}`)
        );
      }

      return result;
    };

    return filterItems(this.cashRegistersData, options, andFilterByStore);
  }

  getTotalRegisterClosures(): Observable<Maybe<number>> {
    return getTotalItems(this.cashRegistersData);
  }
}
