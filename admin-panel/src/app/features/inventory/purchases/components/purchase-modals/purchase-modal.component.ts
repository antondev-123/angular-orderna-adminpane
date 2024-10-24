import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InputTextComponent } from '../../../../../shared/components/input/text/text.component';
import { InputEmailComponent } from '../../../../../shared/components/input/email/email.component';
import { InputSelectComponent } from '../../../../../shared/components/input/select/select.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../../shared/components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { ISupplier, Supplier } from '../../../../../model/supplier';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';
import { InputTextAreaComponent } from '../../../../../shared/components/input/textarea/textarea.component';
import {
  IPurchase,
  Purchase,
  PurchaseCreateData,
  PurchaseUpdateData,
} from '../../../../../model/purchase';
import { StoresDataSource } from '../../../../../services/data-sources/stores.dataSource';
import { SuppliersDataSource } from '../../../../../services/data-sources/supplies.dataSource';
import {
  DEFAULT_QUERY_OPTIONS,
  QueryOptions,
} from '@orderna/admin-panel/src/types/query-options';
import { Store } from '../../../../../model/store';
import { FilterOption } from '@orderna/admin-panel/src/types/filter';
import { ActivatedRoute, Params } from '@angular/router';
import { InputDatePickerComponent } from '../../../../../shared/components/input/datepicker/datepicker.component';
import { IInventoryItem, InventoryItem } from '../../../../../model/inventory';
import { InventorysDataSource } from '../../../../../services/data-sources/inventory.dataSource';
import { Unit } from '../../../../../model/enum/unit-type';
import { LoaderService } from '../../../../../services/shared/loader/loader.service';
import { InputNumberComponent } from '../../../../../shared/components/input/number/number.component';
import { CurrencyCode } from '../../../../../model/enum/currency-code';
import { StoresApiService } from '../../../../../core/stores/stores-api.service';
import { SuppliersApiService } from '../../../../../services/suppliers/suppliers-api.service';
import { InventoryApiService } from '../../../../../services/inventory/inventory-api.service';
import { PurchasesApiService } from '../../../../../services/purchases/purchases-api.service';

interface PageData {
  storeOptions: FilterOption<IPurchase, 'storeId'>[];
  supplierOption: FilterOption<IPurchase, 'supplierId'>[];
  inventoryOption: FilterOption<IPurchase, 'inventoryItemId'>[];
}
@Component({
  selector: 'app-purchase-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    InputTextComponent,
    InputEmailComponent,
    InputSelectComponent,
    ButtonComponent,
    ButtonTextDirective,
    ReactiveFormsModule,
    InputTextAreaComponent,
    InputDatePickerComponent,
    InputNumberComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './purchase-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class PurchaseModalComponent {
  Validators = Validators;
  route: ActivatedRoute = inject(ActivatedRoute);
  loading: boolean = false;
  success: boolean = false;
  inventoryItems = [];
  stores = [];
  suppliers = [];
  errorMessage: string = '';
  formGroup!: FormGroup;
  data$!: Observable<PageData>;

  unitOptions: FilterOption<IInventoryItem, 'unit'>[] = [
    {
      label: 'Gram',
      value: Unit.GRAM,
    },
    {
      label: 'Kilogram',
      value: Unit.KILOGRAM,
    },
  ];
  storesDataSource = new StoresDataSource(this.storesService);
  stores$ = this.storesDataSource.stores$.asObservable();

  supplierdataSource = new SuppliersDataSource(this.suppliersService);
  SuppliersNames$ = this.supplierdataSource.suppliers$.asObservable();

  inventorydataSource = new InventorysDataSource(this.inventoryService);
  InventoryNames$ = this.inventorydataSource.inventorys$.asObservable();

  SupplierQueryOptions!: QueryOptions<ISupplier>;

  fallbackSupplierQueryOptions: QueryOptions<ISupplier> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'id', direction: 'desc' },
  };

  inventoryQueryOptions!: QueryOptions<IInventoryItem>;
  fallbackInventoryQueryOptions: QueryOptions<IInventoryItem> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'id', direction: 'desc' },
  };
  get purchase() {
    return this.data.purchase;
  }

  get mode() {
    return this.purchase ? 'edit' : 'create';
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PurchaseModalComponent>,
    private loaderService: LoaderService,
    private purchasesService: PurchasesApiService,
    private suppliersService: SuppliersApiService,
    private inventoryService: InventoryApiService,
    private storesService: StoresApiService,
    @Inject(MAT_DIALOG_DATA) public data: { purchase: Maybe<Purchase> }
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({});

    this.storesDataSource.loadStores(1, 5000);
    this.supplierdataSource.loadSuppliers(this.SupplierQueryOptions);
    this.inventorydataSource.loadInventorysFormodel(this.inventoryQueryOptions);

    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        return combineLatest([
          this.stores$,
          this.SuppliersNames$,
          this.InventoryNames$,
        ]).pipe(
          map(([stores, supplier, inventory]) => {
            // Enable editing form fields
            this.enableForm();

            return {
              storeOptions: [
                ...stores.map((store) => ({
                  label: store.name,
                  value: store as Store,
                })),
              ],
              supplierOption: [
                ...supplier.map((supplier) => ({
                  label: supplier.firstName + '' + supplier.lastName,
                  value: supplier as Supplier,
                })),
              ],
              inventoryOption: [
                ...inventory.map((inventories) => ({
                  label: inventories.title,
                  value: inventories as InventoryItem,
                })),
              ],
            };
          }),
          catchError(() => {
            this.errorMessage = 'Error while compiling inventory data';
            this.enableForm();
            return of({
              storeOptions: [],
              supplierOption: [],
              inventoryOption: [],
            });
          })
        );
      }),
      catchError((error) => {
        this.enableForm();
        this.errorMessage = error.message;
        return of();
      })
    );
  }

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    if (this.formGroup.invalid) {
      this.loaderService.setLoading(false);
      this.loading = false;
      return;
    }

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    // Prevent user from editing form fields
    this.disableForm();

    if (this.mode === 'create') {
      this.createPurchase();
    } else {
      this.updatePurchaseItem();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `${this.mode} Purchase cancelled.`);
  }

  private createPurchase() {
    const purchaseData = this.formGroup.value;
    const purchase: PurchaseCreateData = {
      inventoryItemId: purchaseData['inventoryItem'].id,
      storeId: purchaseData['store'].id,
      price: purchaseData['unitPrice'],
      quantity: purchaseData['quantity'],
      supplierId: purchaseData['supplier'].id,
      note: purchaseData['note'],
      expirationDate: purchaseData['expirationDate'],
      unit: purchaseData['unit'],
      purchaseDate: purchaseData['purchaseDates'],
      currency: CurrencyCode.PHP,
    };
    this.disableForm();

    this.purchasesService
      .createPurchaseItem(purchase)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private updatePurchaseItem() {
    if (!this.purchase) {
      console.error('No purchase item to update.');
      return;
    }

    const purchaseData = this.formGroup.value;
    const purchase: PurchaseUpdateData = {
      id: this.purchase.id,
      inventoryItemId: purchaseData['inventoryItem'],
      storeId: purchaseData['store'],
      price: purchaseData['unitPrice'],
      quantity: purchaseData['quantity'],
      supplierId: purchaseData['supplier'],
      note: purchaseData['note'],
      expirationDate: purchaseData['expirationDate'],
      unit: purchaseData['unit'],
      purchaseDate: purchaseData['purchaseDates'],
    };

    this.purchasesService
      .updatePurchaseItem(purchase)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess(): void {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(
      this.mode === 'create'
        ? 'purchase item created!'
        : 'purchase item updated!'
    );
    this.reset();
  }

  private handleError(err: any): void {
    this.success = false;
    this.errorMessage = (err as Error).message;
    this.reset();
  }

  private reset(): void {
    // Reset loading states
    this.loading = false;
    this.loaderService.setLoading(false);

    // Reset form
    this.formGroup.reset();
    this.enableForm();

    // Allow supplier to close dialog
    this.dialogRef.disableClose = false;
  }

  private disableForm() {
    for (const control of Object.values(this.formGroup.controls)) {
      control.disable();
    }
  }

  private enableForm() {
    for (const control of Object.values(this.formGroup.controls)) {
      control.enable();
    }
  }
}
