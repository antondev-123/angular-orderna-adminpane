import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { ICashRegister } from '../../../model/cash-register';

export interface ICashRegistersApiService {
  getRegisterClosures(
    options: QueryOptions<ICashRegister>
  ): Observable<Maybe<ICashRegister[]>>;
  getTotalRegisterClosures(): Observable<Maybe<number>>;
}
