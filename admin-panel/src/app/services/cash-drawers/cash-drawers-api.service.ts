import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICashDrawersApiService } from './cash-drawers-api.interface';
import { CashDrawer } from '../../model/cash-drawer';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class CashDrawersApiService implements ICashDrawersApiService {
  private http = inject(HttpClient);

  getLastCashDrawer(): Observable<CashDrawer> {
    return this.http.get<CashDrawer>(API_URL + `cash-drawers/`);
  }
}
