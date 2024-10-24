import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { IZReport } from '../../../model/z-report';

export interface IZReportsApiService {
  getZReports(options: QueryOptions<IZReport>): Observable<Maybe<IZReport[]>>;
  getTotalZReports(): Observable<Maybe<number>>;
  getComputedZReportSummary(): Observable<Maybe<IZReport>>;
}
