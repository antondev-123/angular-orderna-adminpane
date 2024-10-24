import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICashRegistersApiService } from './cash-registers-api.interface';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ICashRegister } from '../../../model/cash-register';
import { CASH_REGISTERS_ANALYTICS_API_URL } from '../cash-registers-analytics-api.constants';

@Injectable({
  providedIn: 'root',
})
export class CashRegistersApiService implements ICashRegistersApiService {
  private http = inject(HttpClient);

  getRegisterClosures(_options: QueryOptions<ICashRegister>): Observable<any> {
    return this.http.get(CASH_REGISTERS_ANALYTICS_API_URL + 'cash-registers');
  }

  getTotalRegisterClosures(): Observable<any> {
    return this.http.get(
      CASH_REGISTERS_ANALYTICS_API_URL + 'cash-registers-number'
    );
  }
}
