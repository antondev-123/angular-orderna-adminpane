import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { ITopSoldProduct, ITotalSales } from '../../model/product';
import { IDashboardFilter } from '../../features/dashboard/dashboard-header/dashboard-header.component';

export interface ISalesApiService {
  getTopSales(filter: IDashboardFilter): Observable<ITopSoldProduct[]>;
  getTotalSales(filter: IDashboardFilter): Observable<Maybe<ITotalSales[]>>;
}
