import { inject, Injectable } from '@angular/core';
import { ISuppliersApiService } from './suppliers-api.interface';
import { HttpClient } from '@angular/common/http';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Observable } from 'rxjs';

import {
  ISupplier,
  SupplierCreateData,
  SupplierUpdateData,
  SupplierUpdateNote,
} from '../../model/supplier';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class SuppliersApiService implements ISuppliersApiService {
  private http = inject(HttpClient);
  getSuppliers(_options: QueryOptions<ISupplier>): Observable<any> {
    return this.http.get(API_URL + 'users');
  }

  getTotalSuppliers(): Observable<any> {
    return this.http.get(API_URL + 'supplier-number');
  }

  deleteSupplier(supplierId: ISupplier['id']): Observable<any> {
    return this.http.post(API_URL + 'supplier-delete', supplierId);
  }

  deleteSuppliers(supplierIds: ISupplier['id'][]): Observable<any> {
    return this.http.post(API_URL + 'supplier-delete-some', supplierIds);
  }

  deleteAllSuppliers(): Observable<any> {
    return this.http.delete(API_URL + 'supplier-delete-all');
  }

  deleteAllSuppliersExcept(supplierIds: ISupplier['id'][]): Observable<any> {
    return this.http.post(API_URL + 'supplier-delete-all-except', supplierIds);
  }

  createSupplier(supplier: SupplierCreateData): Observable<any> {
    return this.http.put(API_URL + 'supplier-create', JSON.stringify(supplier));
  }

  updateSupplier(supplier: SupplierUpdateData): Observable<any> {
    return this.http.put<ISupplier>(
      API_URL + 'supplier-update',
      JSON.stringify(supplier)
    );
  }
}
