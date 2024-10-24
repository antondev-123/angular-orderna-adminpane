import { Observable } from 'rxjs';
import { CashDrawer } from '../../model/cash-drawer';

export interface ICashDrawersApiService {
  getLastCashDrawer(): Observable<CashDrawer>;
}
