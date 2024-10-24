import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  effect,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  Product,
  ProductCreateData,
  ProductUpdateData,
} from '@orderna/admin-panel/src/app/model/product';
import { LoaderService } from '@orderna/admin-panel/src/app/services/shared/loader/loader.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { take, takeUntil, tap } from 'rxjs';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../button/button.component';
import { InputEmailComponent } from '../../input/email/email.component';
import { InputFileComponent } from '../../input/file/file.component';
import { InputSelectComponent } from '../../input/select/select.component';
import { InputTextComponent } from '../../input/text/text.component';
import { MatIconModule } from '@angular/material/icon';
import { InputNumberComponent } from '../../input/number/number.component';
import {
  MatTabChangeEvent,
  MatTabGroup,
  MatTabsModule,
} from '@angular/material/tabs';
import { InventoryItemUsed } from '@orderna/admin-panel/src/app/model/inventory-item-used';
import {
  FilterOption,
  FilterOptionItem,
} from '@orderna/admin-panel/src/types/filter';
import { DashedBorderAddButtonComponent } from '../../button/dashed-border-add-button/dashed-border-add-button.component';
import { InventoryItem } from '@orderna/admin-panel/src/app/model/inventory';
import { SubscriptionManager } from '@orderna/admin-panel/src/utils/subscription-manager';
import { ModifierGroupTableComponent } from '../../../../features/products/components/modifier-group/modifier-group-table/modifier-group-table.component';
import { ModifierGroupModalComponent } from '../../../../features/products/components/modifier-group/modifier-group-modals/modifier-group-modal.component';
import { ModifierGroup } from '@orderna/admin-panel/src/app/model/modifier-group';
import { ModifierGroupConfirmDeleteModalComponent } from '../../../../features/products/components/modifier-group/modifier-group-modals/modifier-group-confirm-delete-modal.component';
import { ProductConfirmDeleteModalComponent } from './product-confirm-delete-modal.component';
import { InputTextAreaComponent } from '../../input/textarea/textarea.component';
import { ProductsApiService } from '@orderna/admin-panel/src/app/services/products/products-api.service';
import { InventoryApiService } from '@orderna/admin-panel/src/app/services/inventory/inventory-api.service';

enum TabIndex {
  DETAILS = 0,
  INVENTORY_ITEMS_USED = 1,
  MODIFIERS = 2,
  DELETE = 3,
}

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatTabsModule,
    MatIconModule,

    InputFileComponent,
    InputTextComponent,
    InputEmailComponent,
    InputNumberComponent,
    InputSelectComponent,
    InputTextAreaComponent,
    ButtonComponent,
    ButtonTextDirective,

    ModifierGroupTableComponent,
    DashedBorderAddButtonComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-modal.component.html',
  styleUrls: ['../modal.component.scss', './product-modal.component.scss'],
})
export class ProductModalComponent
  extends SubscriptionManager
  implements OnInit, AfterViewInit
{
  Validators = Validators;
  TabIndex = TabIndex;

  loading: boolean = false;
  success: boolean = false;
  showPreview: boolean = false;
  inventoryItemsViewed: InventoryItem['id'][] = [];
  errorMessage: string = '';
  detailsFormGroup!: FormGroup;
  inventoryItemsUsedFormGroup!: FormGroup;

  selectedTabIndex = signal<TabIndex>(TabIndex.DETAILS);

  // Holds state of each controls row in the 'Inventory Items Used' tab
  inventoryItemIdByRow = signal<{
    [index: number]: InventoryItemUsed['id'];
  }>({});
  inventoryItemUnitByRow = signal<{
    [index: number]: InventoryItem['unit'];
  }>({});
  inventoryItemOptionsByRow = signal<{
    [index: number]: FilterOption<InventoryItemUsed, 'id'>[];
  }>({});
  modifierGroupTableData = signal<ModifierGroup[]>([]);

  allInventoryItems: InventoryItem[] = [];
  allInventoryItemOptions: FilterOptionItem<InventoryItemUsed['id']>[] = [];

  isViewInitDone = signal<boolean>(false);
  isExtendedProductLoaded = signal<boolean>(false);
  isInventoryItemOptionsLoaded = signal<boolean>(false);

  // Product with inventory items used and modifier groups
  extendedProduct?: Product;

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  get modalTitle() {
    const isEditMode = this.mode === 'edit';
    let title = `${isEditMode ? 'Edit' : 'Add'} Product`;
    if (isEditMode && this.product) {
      title += ` - ${this.product.title}`;
    }
    return title;
  }

  get inventoryItemsUsedFormArray() {
    return this.inventoryItemsUsedFormGroup.get(
      'inventoryItemsUsed'
    ) as FormArray;
  }

  get storeId() {
    return this.data.storeId;
  }

  get product() {
    return this.data.product;
  }

  get mode() {
    return this.product ? 'edit' : 'create';
  }

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProductModalComponent>,
    private loaderService: LoaderService,
    private productsService: ProductsApiService,
    private inventoryService: InventoryApiService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      product: Maybe<Product>;
      storeId: number;
      categoryId: number;
    }
  ) {
    super();

    const patchInventoryItemsEffect = effect(
      () => {
        if (this.mode === 'create' && this.isInventoryItemOptionsLoaded()) {
          this.updateInventoryItemOptionsOfAllRows();
          patchInventoryItemsEffect.destroy();
        } else if (
          this.mode === 'edit' &&
          this.isViewInitDone() &&
          this.isExtendedProductLoaded() &&
          this.isInventoryItemOptionsLoaded()
        ) {
          this.patchInventoryItemsUsed();
          this.updateInventoryItemOptionsOfAllRows();
          patchInventoryItemsEffect.destroy();
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.detailsFormGroup = this.formBuilder.group({});
    this.inventoryItemsUsedFormGroup = this.formBuilder.group({
      inventoryItemsUsed: this.formBuilder.array([]),
    });
    this.showPreview = true;

    this.loadInventoryItemOptions();
    this.loadExtendedProduct();
  }

  ngAfterViewInit() {
    this.isViewInitDone.set(true);
  }

  patchInventoryItemsUsed() {
    if (!this.extendedProduct || this.inventoryItemsUsedFormArray.length === 0)
      return;
    const inventoryItemsUsed :any= this.extendedProduct.inventory;
    const controls = this.inventoryItemsUsedFormArray.controls;
    for (let index = 0; index < controls.length; index++) {
      const inventoryItemUsed = inventoryItemsUsed[index];
      controls[index].patchValue({
        inventoryItemId: inventoryItemUsed.inventory_item_id,
        quantity: inventoryItemUsed.quantity,
      });
    }
  }

  loadExtendedProduct() {
    if (!this.product) {
      this.initializeInventoryItemsUsedControls();
      return;
    }

    const productId :any = this.product.productId ?? this.product.id;
    const storeId = this.data.storeId;

    this.productsService
      .getProductById(productId)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((product) => {
          if (!product) {
            throw new Error(`No product with ID ${productId} found.`);
          }

          this.extendedProduct = product.data;
          this.isExtendedProductLoaded.set(true);
          this.modifierGroupTableData.set(product.modifiers);

          this.inventoryItemIdByRow.set(
            product.data.inventory.reduce((acc: { [index: number]: InventoryItem['id'] }, o: { inventoryItemId: InventoryItem['id'] }, index: number) => {
              acc[index] = o.inventoryItemId;
              return acc;
            }, {})
          );

          // Note: Order of function calls below is important
          this.initializeInventoryItemsUsedControls(product.data.inventory);
          this.updateInventoryItemOptionsOfAllRows();
        })
      )
      .subscribe();
  }

  loadInventoryItemOptions() {
    // Load only the inventory items associated with the current store

    // TODO: Make page and perPage optional
    // Note: Used 5000 to get all inventory items
    const inventorysQuery = {
      page: 1,
      perPage: 5000,
      filters: [{ field: 'store', value: `${this.data.storeId}` }],
    };

    this.inventoryService
      .getInventory(inventorysQuery)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((inventoryItems) => {
          console.log('loadInventoryItems', inventoryItems);
          this.allInventoryItems = inventoryItems.data.inventories ?? [];
          this.allInventoryItemOptions = this.allInventoryItems.map((o) => ({
            label: o.title,
            value: o.id,
          }));
          this.isInventoryItemOptionsLoaded.set(true);
        })
      )
      .subscribe();
  }

  initializeInventoryItemsUsedControls(
    inventoryItemsUsed?: InventoryItemUsed[]
  ) {
    if (inventoryItemsUsed) {
      for (const inventoryItemUsed of inventoryItemsUsed) {
        this.addInventoryItemUsedControls(inventoryItemUsed);
      }
    } else {
      this.addInventoryItemUsedControls();
    }
  }

  getDefaultUnit(inventoryItemId?: number): string {
    if (inventoryItemId) {
      const foundItem = this.allInventoryItems.find(item => item.id === inventoryItemId);
      return foundItem?.unit || 'kg';
    }
    return 'kg'; 
  }

  addInventoryItemUsedControls(item?: InventoryItemUsed) {
    const unitValue = item?.unit || this.getDefaultUnit(item?.inventoryItemId);
    // Assign this item's inventory item used and quantity to its corresponding control
    const inventoryItemUsedControls = this.formBuilder.group({
      unit:  unitValue
    });
    this.inventoryItemsUsedFormArray.push(inventoryItemUsedControls);

    // Index of newly added inventory item used controls
    const index = this.inventoryItemsUsedFormArray.length - 1;
    // Set this item's unit to state that holds units data
    if (item) {
      this.inventoryItemUnitByRow.update((state) => ({
        ...state,
      }));
    }

    if (!item) {
      this.updateInventoryItemOptionsOfRow(index);
    }

    this.cdr.detectChanges();
  }

  removeInventoryItemUsedControls(index: number) {
    this.inventoryItemsUsedFormArray.removeAt(index);
    this.resetInventoryItemUsedStates(index);
    this.updateInventoryItemOptionsOfAllRows();
  }

  resetInventoryItemUsedStates(index: number) {
    this.inventoryItemIdByRow.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.inventoryItemUnitByRow.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.inventoryItemOptionsByRow.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
  }

  updateInventoryItemOptionsOfAllRows(except?: InventoryItemUsed['id']) {
    for (
      let index = 0;
      index < this.inventoryItemsUsedFormArray.controls.length;
      index++
    ) {
      if (index !== except) {
        this.updateInventoryItemOptionsOfRow(index);
      }
    }
  }

  updateInventoryItemOptionsOfRow(index: number) {
    const selectedInventoryItemAtRow =
      this.inventoryItemsUsedFormArray.controls[index].value['inventoryItemId'];
    const selectedInventoryItemIds = Object.values(this.inventoryItemIdByRow());
    const filteredInventoryItemOptions = this.allInventoryItemOptions.filter(
      (o) =>
        !selectedInventoryItemIds.includes(o.value) ||
        o.value === selectedInventoryItemAtRow
    );

    this.inventoryItemOptionsByRow.update((state) => ({
      ...state,
      [index]: filteredInventoryItemOptions,
    }));
  }

  goToTab(index: TabIndex) {
    if (!this.tabGroup) return;
    this.tabGroup.selectedIndex = index;
  }

  handleAddInventoryItemUsedButtonClicked(event: MouseEvent) {
    event.preventDefault();
    this.addInventoryItemUsedControls();
  }

  handleSelectedTabChange(event: MatTabChangeEvent) {
    this.selectedTabIndex.set(event.index);
  }

  handleDelete() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    if (!this.product) {
      console.error('No product to delete.');
      return;
    }
    const productIdsToDelete = [this.product.id];
    this.productsService
      .deleteProducts(this.data.storeId, this.data.categoryId, productIdsToDelete)
      .pipe(take(1))
      .subscribe({
        next: (result) => this.handleSuccess(result),
        error: (err) => this.handleError(err),
      });
  }

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    if (this.detailsFormGroup.invalid) {
      this.loaderService.setLoading(false);
      this.loading = false;
      return;
    }

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    // Prevent user from editing form fields
    this.disableForm();

    if (this.mode === 'create') {
      this.createProduct();
    } else {
      this.updateProduct();
    }
  }

  onInventoryItemSelectedChanged(
    index: number,
    inventoryItemId: Maybe<InventoryItemUsed['id'] | any>
  ) {  
    // Update unit (e.g. kg, g) shown in row  
    const selectedInventoryItem = this.allInventoryItems.find(
      (o) => o.id === inventoryItemId
    );
    if (!selectedInventoryItem) {
      throw new Error(`No inventory item with ID ${inventoryItemId} found.`);
    }
    const selectedInventoryItemUnit = selectedInventoryItem.unit;
    this.inventoryItemUnitByRow.update((state) => ({
      ...state,
      [index]: selectedInventoryItemUnit,
    }));

    // Update currently selected inventory items
    this.inventoryItemIdByRow.update((state) => ({
      ...state,
      [index]: inventoryItemId as InventoryItemUsed['id'],
    }));

    // Update inventory item options of all rows except current row
    this.updateInventoryItemOptionsOfAllRows(index);
  }

  getInventoryItemOptions(index: number) {
    return index in this.inventoryItemOptionsByRow()
      ? this.inventoryItemOptionsByRow()[index]
      : [];
  }

  openModifierGroupModal(modifierGroup?: ModifierGroup) {
    if (!this.product) {
      throw new Error('Cannot open modifier group modal without a product');
    }

    const dialogRef = this.dialog.open(ModifierGroupModalComponent, {
      id: 'modifier-group-modal',
      data: {
        modifierGroup,
        storeId: this.storeId,
        productId: this.product.id,
      },
      // Note: Material dialog components are globally configured (see app.config.ts) to take up a maximum of 512px horizontally,
      //       but this modal have inputs (particularly product inputs) that would benefit from some extra space
      //       that's why it overrides the dialog width below to take up 600px.
      maxWidth: 600,
      minWidth: 600,
      minHeight: 740,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((newModifier) => {
        if (!newModifier) {
          console.log('Modifier group modal closed!');
          return;
        }

        const oldModifierIndex = this.modifierGroupTableData().findIndex(
          (m) => m.id === newModifier.id
        );
        if (oldModifierIndex === -1) {
          this.modifierGroupTableData.update((data) => [newModifier, ...data]);
        } else {
          this.modifierGroupTableData.update((data) => [
            ...data.slice(0, oldModifierIndex),
            newModifier,
            ...data.slice(oldModifierIndex + 1),
          ]);
        }
      });
  }

  openModifierGroupConfirmDeleteModal(modifierGroup: ModifierGroup) {
    const dialogRef = this.dialog.open(
      ModifierGroupConfirmDeleteModalComponent,
      {
        id: 'modifier-group-confirm-delete-modal',
        data: {
          modifierGroup,
        },
      }
    );

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          console.log('Modifier group confirm delete modal cancelled!');
          return;
        }

        const oldModifierIndex = this.modifierGroupTableData().findIndex(
          (m) => m.id === modifierGroup.id
        );
        if (oldModifierIndex !== -1) {
          this.modifierGroupTableData.update((data) =>
            data.filter((d) => d.id !== modifierGroup.id)
          );
        }
      });
  }

  openProductConfirmDeleteModal() {
    const dialogRef = this.dialog.open(ProductConfirmDeleteModalComponent, {
      id: 'product-confirm-delete-modal',
      data: {
        product: this.product,
        storeId: this.storeId,
        categoryId: this.data.categoryId,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        this.closeDialog();
      });
  }

  closeDialog(result?: any) {
    this.dialogRef.close(result ? result : undefined);
  }

  deleteFile() {
    this.detailsFormGroup.controls['image'].setValue('');
    if (this.product) {
      this.product['image'] = '';
    }
  }

  receive(data: any) {
    if (data.length > 0) {
      this.showPreview = false;
    } else {
      this.showPreview = true;
    }
    this.cdr.detectChanges();
  }

  getTabLabelClass(index: TabIndex) {
    const classes = ['ord-tab-label'];

    if (index === TabIndex.DELETE) {
      classes.push('ord-tab-label-warn');
    }

    if (this.selectedTabIndex() === index) {
      classes.push('ord-tab-label--active');
    }

    return classes;
  }

  private createProduct() {  
    const productDetailsData = this.detailsFormGroup.value;
    const productInventoryItemsUsedData =
    this.inventoryItemsUsedFormGroup.value;

    const product: ProductCreateData = {
      title: productDetailsData['title'],
      cost: productDetailsData['cost'],
      price: productDetailsData['price'],
      unit: productDetailsData['unit'],
      stock: productDetailsData['stock'],
      sk_plu: productDetailsData['sk_plu'],
      description: productDetailsData['description'],
      category: this.data.categoryId,
      status: productDetailsData['status'],
      image: productDetailsData['image'],
      inventoryItems: productInventoryItemsUsedData['inventoryItemsUsed'],
    };

    this.disableForm();
    this.productsService
      .createProduct(product, this.data.storeId, this.data.categoryId)
      .pipe(take(1))
      .subscribe({
        next: (result) => this.handleSuccess(result),
        error: (err) => this.handleError(err),
      });
  }

  private updateProduct() {
    if (!this.product) {
      console.error('No user to update.');
      return;
    }

    const productDetailsData = this.detailsFormGroup.value;
    const productInventoryItemsUsedData =
      this.inventoryItemsUsedFormGroup.value;

    const product: ProductUpdateData = {
      id: this.product.id,
      title: productDetailsData['title'],
      description: productDetailsData['description'],
      sk_plu: productDetailsData['sk_plu'],
      unit: productDetailsData['unit'],
      stock: productDetailsData['stock'],
      cost: productDetailsData['cost'],
      price: productDetailsData['price'],
      category: productDetailsData['category'],
      status: productDetailsData['status'],
      inventoryItems: productInventoryItemsUsedData['inventoryItemsUsed'],
    };
    if ((product as any)['id']) {
      delete (product as any)['id'];
    }

    this.productsService
      .updateProduct(product, this.product.productId, this.data.categoryId)
      .pipe(take(1))
      .subscribe({
        next: (result) => this.handleSuccess(result),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess(result: any): void {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(result);
    this.resetForm();
  }

  private handleError(err: any): void {
    this.success = false;
    this.errorMessage = (err as Error).message;
    this.resetForm();
  }

  private resetForm(): void {
    // Reset loading states
    this.loading = false;
    this.loaderService.setLoading(false);

    // Reset form
    this.detailsFormGroup.reset();
    this.enableForm();

    // Allow user to close dialog
    this.dialogRef.disableClose = false;
  }

  private disableForm() {
    for (const control of Object.values(this.detailsFormGroup.controls)) {
      control.disable();
    }
  }

  private enableForm() {
    for (const control of Object.values(this.detailsFormGroup.controls)) {
      control.enable();
    }
  }
}
