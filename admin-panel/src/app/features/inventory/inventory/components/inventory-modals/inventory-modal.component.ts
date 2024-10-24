import { Component, Inject, ViewEncapsulation, inject } from '@angular/core';
import {
  IInventoryItem,
  InventoryItem,
  InventoryItemCreateData,
  InventoryItemUpdateData,
} from '../../../../../model/inventory';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { LoaderService } from '../../../../../services/shared/loader/loader.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { InputTextComponent } from '../../../../../shared/components/input/text/text.component';
import { InputSelectComponent } from '../../../../../shared/components/input/select/select.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../../shared/components/button/button.component';
import {
  FilterOption,
  FilterOptionItem,
} from '@orderna/admin-panel/src/types/filter';
import { Unit } from '../../../../../model/enum/unit-type';
import { StoresDataSource } from '../../../../../services/data-sources/stores.dataSource';
import {
  DEFAULT_QUERY_OPTIONS,
  QueryOptions,
} from '@orderna/admin-panel/src/types/query-options';
import { IStore, Store } from '../../../../../model/store';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StoresApiService } from '../../../../../core/stores/stores-api.service';
import { InventoryApiService } from '../../../../../services/inventory/inventory-api.service';
interface PageData {
  storeOptions: FilterOption<IInventoryItem, 'storeId'>[];
}
@Component({
  selector: 'app-inventory-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    InputTextComponent,
    InputSelectComponent,
    ButtonComponent,
    ButtonTextDirective,
    ReactiveFormsModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './inventory-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class InventoryModalComponent {
  Validators = Validators;

  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';
  formGroup!: FormGroup;
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

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
  data$!: Observable<PageData>;

  storeQueryOptions!: QueryOptions<IStore>;
  fallbackStoreQueryOptions: QueryOptions<IStore> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'name', direction: 'desc' },
  };
  inventoryStoreName:string = ''

  get inventory() {
    return this.data.inventory;
  }

  get mode() {
    return this.inventory ? 'edit' : 'create';
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<InventoryModalComponent>,
    private loaderService: LoaderService,
    private inventoryService: InventoryApiService,
    private storesService: StoresApiService,
    @Inject(MAT_DIALOG_DATA) public data: { inventory: Maybe<InventoryItem> }
  ) {}
  
 ngAfterViewInit()
 {
   this.stores$.subscribe((stores: any[]) => {
   const store = stores.find((store) => store.id == this.data.inventory?.storeId);
     if (store) {
       this.inventoryStoreName = store;
     } 
   })
 }
 
  ngOnInit() {
    this.formGroup = this.formBuilder.group({});
    this.storesDataSource.loadStores(1, 5000);
    this.disableForm();
    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        return combineLatest([this.stores$]).pipe(
          map(([stores]) => {
            // Enable editing form fields
            this.enableForm();

            return {
              storeOptions: [
                ...stores.map((store) => ({
                  label: store.name,
                  value: store as Store,
                })),
              ],
            };
          }),
          catchError(() => {
            this.errorMessage = 'Error while compiling inventory data';
            this.enableForm();
            return of({
              storeOptions: [],
              customerOptions: [],
              productOptions: [],
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
      this.createInventory();
    } else {
      this.updateInventory();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `${this.mode} inventory cancelled.`);
  }

  private createInventory() {
    const inventoryData = this.formGroup.value;
    const inventory: InventoryItemCreateData = {
      title: inventoryData['title'],
      unit: inventoryData['unit'],
      sk_plu: inventoryData['sk_plu'],
      storeId: inventoryData['storeId'].id,
    };

    this.disableForm();

    this.inventoryService
      .createInventoryItem(inventory)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private updateInventory() {
    if (!this.inventory) {
      console.error('No inventory to update.');
      return;
    }

    const inventoryData = this.formGroup.value;
    const inventory: InventoryItemUpdateData = {
      id: this.inventory.id,
      title: inventoryData['title'],
      unit: inventoryData['unit'],
      sk_plu: inventoryData['sk_plu'],
      storeId: inventoryData['storeId'].id,
    };
    this.inventoryService
      .updateInventoryItem(this.inventory.id,inventory)
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
      this.mode === 'create' ? 'inventory created!' : 'inventory updated!'
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

    // Allow inventory to close dialog
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
