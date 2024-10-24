import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Observable } from 'rxjs';
import {
  ISupplier,
  SupplierCreateData,
  SupplierUpdateData,
  SupplierUpdateNote,
} from '../../model/supplier';

export interface ISuppliersApiService {
  getSuppliers(option: QueryOptions<ISupplier>): Observable<Maybe<ISupplier[]>>;
  getTotalSuppliers(): Observable<Maybe<number>>;
  deleteSupplier(supplierId: ISupplier['id']): Observable<ISupplier>;
  deleteSuppliers(supplierIds: ISupplier['id'][]): Observable<ISupplier[]>;
  deleteAllSuppliers(): Observable<ISupplier[]>;
  deleteAllSuppliersExcept(
    supplierIds: ISupplier['id'][]
  ): Observable<ISupplier[]>;

  createSupplier(supplier: SupplierCreateData): Observable<ISupplier>;
  updateSupplier(supplier: SupplierUpdateData): Observable<ISupplier>;
}
