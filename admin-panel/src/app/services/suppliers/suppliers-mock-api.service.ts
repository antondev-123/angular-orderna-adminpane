import { Injectable } from '@angular/core';
import { ISuppliersApiService } from './suppliers-api.interface';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  createItem,
  Data,
  deleteAllItems,
  deleteAllItemsExcept,
  deleteItem,
  deleteItems,
  filterItems,
  getTotalItems,
  updateItem,
} from '@orderna/admin-panel/src/utils/service';
import { Status } from '../../model/enum/status';
import {
  ISupplier,
  Supplier,
  SupplierCreateData,
  SupplierUpdateData,
  SupplierUpdateNote,
} from '../../model/supplier';
import { SUPPLIERS } from '../../data/suppliers';
import { PaymentType } from '../../model/enum/payment-type';

@Injectable({
  providedIn: 'root',
})
export class SuppliersMockApiService implements ISuppliersApiService {
  data = {
    suppliers: {
      items: [...SUPPLIERS],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<ISupplier>,
      subject: new BehaviorSubject<Maybe<Supplier[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get supplierData() {
    return this.data['suppliers'] as Data<Supplier, ISupplier>;
  }

  getSuppliers(
    options: QueryOptions<ISupplier>
  ): Observable<Maybe<ISupplier[]>> {
    return filterItems(this.supplierData, options);
  }

  getTotalSuppliers(): Observable<Maybe<number>> {
    return getTotalItems(this.supplierData);
  }

  deleteSupplier(supplierId: Supplier['id']): Observable<ISupplier> {
    return deleteItem(this.supplierData, supplierId);
  }

  deleteSuppliers(supplierIds: Supplier['id'][]): Observable<ISupplier[]> {
    return deleteItems(this.supplierData, supplierIds);
  }

  deleteAllSuppliers(): Observable<ISupplier[]> {
    return deleteAllItems(this.supplierData);
  }

  deleteAllSuppliersExcept(
    supplierIds: Supplier['id'][]
  ): Observable<ISupplier[]> {
    return deleteAllItemsExcept(this.supplierData, supplierIds);
  }

  createSupplier(supplier: SupplierCreateData): Observable<ISupplier> {
    const newSupplier = Supplier.fromJSON({
      ...supplier,
      id: this.supplierData.items.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      store: '2',
      orders: 20,
      lastOrder: '#908764',
      toatlSpend: 1289.97,
      refunds: 2,
      status: Status.ACTIVE,
      paymentType: PaymentType.CASH,
    });
    return createItem(this.supplierData, newSupplier);
  }

  updateSupplier(supplier: SupplierUpdateData): Observable<ISupplier> {
    return updateItem(this.supplierData, supplier);
  }
}
