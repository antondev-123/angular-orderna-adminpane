import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  inject,
  signal,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BadgeComponent } from '@orderna/admin-panel/src/app/shared/components/badge/badge.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { DashedBorderAddButtonComponent } from '@orderna/admin-panel/src/app/shared/components/button/dashed-border-add-button/dashed-border-add-button.component';
import { InputDatePickerComponent } from '@orderna/admin-panel/src/app/shared/components/input/datepicker/datepicker.component';
import { InputEmailComponent } from '@orderna/admin-panel/src/app/shared/components/input/email/email.component';
import { InputNumberComponent } from '@orderna/admin-panel/src/app/shared/components/input/number/number.component';
import { InputSelectComponent } from '@orderna/admin-panel/src/app/shared/components/input/select/select.component';
import { InputTextComponent } from '@orderna/admin-panel/src/app/shared/components/input/text/text.component';
import { InputTextAreaComponent } from '@orderna/admin-panel/src/app/shared/components/input/textarea/textarea.component';
import { Customer } from '@orderna/admin-panel/src/app/model/customer';
import {
  DiscountDetail,
  DiscountSummary,
} from '@orderna/admin-panel/src/app/model/discount';
import { DiscountType } from '@orderna/admin-panel/src/app/model/enum/discount-type';
import {
  PAYMENT_TYPE_OPTIONS,
  PaymentType,
} from '@orderna/admin-panel/src/app/model/enum/payment-type';
import { TransactionStatus } from '@orderna/admin-panel/src/app/model/enum/transaction-status';
import { TransactionType } from '@orderna/admin-panel/src/app/model/enum/transaction-type';
import { IProduct, Product } from '@orderna/admin-panel/src/app/model/product';
import { IStore, Store } from '@orderna/admin-panel/src/app/model/store';
import {
  ITransaction,
  Transaction,
  TransactionCreateData,
  TransactionUpdateData,
} from '@orderna/admin-panel/src/app/model/transaction';
import { TransactionItem } from '@orderna/admin-panel/src/app/model/transaction-item';
import { IUser } from '@orderna/admin-panel/src/app/model/user';
import { CustomersApiService } from '@orderna/admin-panel/src/app/services/customers/customers-api.service';
import { DiscountsApiService } from '@orderna/admin-panel/src/app/services/discounts/discounts-api.service';
import { ProductsApiService } from '@orderna/admin-panel/src/app/services/products/products-api.service';
import { LoaderService } from '@orderna/admin-panel/src/app/services/shared/loader/loader.service';
import { StoresApiService } from '@orderna/admin-panel/src/app/core/stores/stores-api.service';
import { TransactionsApiService } from '@orderna/admin-panel/src/app/services/transactions/transactions-api.service';
import { UsersApiService } from '@orderna/admin-panel/src/app/services/users/users-api.service';
import {
  FilterOptionItem,
  FilterOption,
} from '@orderna/admin-panel/src/types/filter';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import {
  startWith,
  Observable,
  switchMap,
  combineLatest,
  map,
  catchError,
  of,
  take,
} from 'rxjs';

interface PageData {
  storeOptions: FilterOptionItem<IStore>[];
  customerOptions: FilterOptionItem<ITransaction['customer'] | 'walk-in'>[];
  userOptions: FilterOptionItem<IUser>[];
}
@Component({
  selector: 'app-modal-transaction',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    InputTextComponent,
    InputEmailComponent,
    InputSelectComponent,
    InputDatePickerComponent,
    InputTextAreaComponent,
    InputNumberComponent,
    BadgeComponent,
    ButtonComponent,
    ButtonTextDirective,
    DashedBorderAddButtonComponent,
    ReactiveFormsModule,
    MatTabsModule,
    MatSlideToggle,
    MatExpansionModule,
    CdkScrollable,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './transaction-modal.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
    './transaction-modal.component.scss',
  ],
})
export class TransactionModalComponent implements OnInit {
  Validators = Validators;

  dateNow = new Date();

  loading: boolean = false;
  success: boolean = false;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  errorMessage: string = '';
  formGroup!: FormGroup;

  // Tracks whether note panels are expanded/collapsed
  notePanelsState = signal<{ [index: number]: boolean }>({});

  // Transaction item prices
  unitPricesState = signal<{ [index: number]: number }>({});
  salePricesState = signal<{ [index: number]: number }>({});
  discountPricesState = signal<{ [index: number]: number }>({});
  refundPricesState = signal<{ [index: number]: number }>({});
  netSalesPricesState = signal<{ [index: number]: number }>({});

  totalPricesState = signal<{ [index: number]: number }>({}); // May have discounts applied
  originalTotalPricesState = signal<{ [index: number]: number }>({}); // Original price without discounts

  // Total row prices
  saleAmount = signal<number>(this.transaction?.salePrice ?? 0);
  refundsAmount = signal<number>(this.transaction?.discountAmount ?? 0);
  discountAmount = signal<number>(this.transaction?.refundAmount ?? 0);
  subtotalAmount = signal<number>(this.transaction?.netSales ?? 0);

  // Data source for select inputs
  products: Maybe<IProduct[]> = null;
  discounts: Maybe<DiscountDetail[]> = null;

  // Select input options
  productOptionsState = signal<{
    [index: number]: FilterOption<IProduct, 'id'>[];
  }>({});
  // TODO: Consolidate
  discountOptionsState = signal<FilterOption<ITransaction, 'discount'>[]>([]); // old way
  discountIdOptionsState = signal<FilterOption<DiscountSummary, 'id'>[]>([]); // preferred way

  // Currently selected items
  selectedStoreId = signal<Store['id'] | null>(null);
  selectedProductIdsState = signal<{ [index: number]: Product['id'] }>({});

  statusOptions: FilterOption<ITransaction, 'status'>[] = [
    {
      label: 'Approved',
      value: TransactionStatus.APPROVED,
    },
    {
      label: 'Pending',
      value: TransactionStatus.PENDING,
    },
    {
      label: 'Refunded',
      value: TransactionStatus.REFUNDED,
    },
    {
      label: 'Fail',
      value: TransactionStatus.FAIL,
    },
  ];

  typeOptions: FilterOption<ITransaction, 'transactionType'>[] = [
    { label: 'In Store', value: TransactionType.IN_STORE },
    { label: 'Online', value: TransactionType.ONLINE },
    { label: 'Delivery', value: TransactionType.DELIVERY },
    { label: 'Pick Up', value: TransactionType.PICK_UP },
    { label: 'Counter', value: TransactionType.COUNTER },
  ];

  paymentTypeOptions: FilterOption<ITransaction, 'paymentType'>[] =
    PAYMENT_TYPE_OPTIONS;

  defaultTypeOption = this.typeOptions[4] as FilterOptionItem<TransactionType>;
  defaultStatusOption = this
    .statusOptions[0] as FilterOptionItem<TransactionStatus>;
  defaultPaymentTypeOption = this
    .paymentTypeOptions[0] as FilterOptionItem<PaymentType>;
  defaultCustomerOption = {
    label: 'Walk In',
    value: 'walk-in',
  } as FilterOptionItem<Transaction['customer'] | 'walk-in'>;

  // TODO: Make perPage and page optional
  defaultQueryOptions = {
    page: 1,
    perPage: 5000, // pass large number so we get everything
  };

  stores$ = this.storesService
    .getStores(this.defaultQueryOptions.page, this.defaultQueryOptions.perPage)
    .pipe(startWith({ count: 0, data: [] }));
  customers$ = this.customersService
    .getCustomers(this.defaultQueryOptions)
    .pipe(startWith([]));
  users$ = this.usersService
    .getUsers(this.defaultQueryOptions)
    .pipe(startWith([]));

  data$!: Observable<PageData>;

  get modalTitle() {
    const isEditMode = this.mode === 'edit';
    let title = `${isEditMode ? 'Edit' : 'Add'} Transaction`;
    if (isEditMode && this.transaction) {
      title += ` - ${this.transaction.id.slice(-12)}`;
    }
    return title;
  }

  get transaction() {
    return this.data.transaction;
  }

  get transactionItemsFormArray() {
    return this.formGroup.get('items') as FormArray;
  }

  get allProductOptions() {
    return (this.products ?? []).map((product) => ({
      label: product.title,
      value: product.id,
    }));
  }

  get mode() {
    return this.transaction ? 'edit' : 'create';
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TransactionModalComponent>,
    private loaderService: LoaderService,
    private discountsService: DiscountsApiService,
    private productsService: ProductsApiService,
    private transactionsService: TransactionsApiService,
    private customersService: CustomersApiService,
    private usersService: UsersApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: Maybe<Transaction> }
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });

    this.initializeTransactionItemControls();

    this.selectedStoreId.set(this.transaction?.store.id ?? null);
    this.initializeProducts();
    this.initializeDiscounts();

    this.disableForm();

    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        return combineLatest([this.stores$, this.customers$, this.users$]).pipe(
          map(([stores, customers, users]) => {
            this.enableForm();

            return {
              storeOptions: [
                ...(stores?.data ?? []).map((store: IStore) => ({
                  label: store.name,
                  value: store as IStore,
                })),
              ],
              customerOptions: [
                this.defaultCustomerOption,
                ...(customers ?? []).map((customer) => ({
                  label: customer.firstName + ' ' + customer.lastName,
                  value: customer as Customer,
                })),
              ],
              userOptions: [
                ...(users ?? []).map((user) => ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user,
                })),
              ],
            };
          }),
          catchError((error) => {
            console.log(error);
            this.errorMessage = 'Error while compiling transaction data';
            this.enableForm();
            return of({
              storeOptions: [],
              customerOptions: [],
              userOptions: [],
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

  initializeTransactionItemControls() {
    if (this.transaction) {
      for (const item of this.transaction?.items ?? []) {
        this.addTransactionItemControls(item);
      }
    } else {
      this.addTransactionItemControls();
    }
  }

  initializeProducts() {
    this.loadProducts();
  }

  initializeDiscounts() {
    this.loadDiscounts();
  }

  addTransactionItemControls(item?: TransactionItem) {
    const transactionItemControl = this.formBuilder.group({
      // Note: Controls for other fields e.g. product, quantity, discount, note
      //       are added dynamically in their corresponding input components
      //       e.g. product's InputSelectComponent, quantity's InputNumberComponent.
      //       Only 'wasRefunded', a slide toggle, doesn't have a component
      //       so it need to be added here.
      id: item ? item.id : undefined, // Helps determine if item is updated or newly added
      wasRefunded: item ? item.wasRefunded : false,
    });

    this.transactionItemsFormArray.push(transactionItemControl);

    // Index of newly added transaction item controls
    const index = this.transactionItemsFormArray.length - 1;

    if (!item) {
      this.updateProductOptions(index);
    }

    this.cdr.detectChanges();
  }

  removeTransactionItemControls(index: number) {
    this.transactionItemsFormArray.removeAt(index);

    this.resetTransactionItemStates(index);
  }

  resetTransactionItemStates(index: number) {
    this.notePanelsState.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.unitPricesState.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.salePricesState.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.discountPricesState.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.refundPricesState.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.netSalesPricesState.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.totalPricesState.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.originalTotalPricesState.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.productOptionsState.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.selectedProductIdsState.update((state) => {
      const stateCopy = { ...state };
      delete stateCopy[index];
      return stateCopy;
    });
    this.recomputeTotalRowAmounts();
  }

  loadProducts() {
    const storeId = this.selectedStoreId();
    if (storeId === null) return;

    const productsQuery = {
      ...this.defaultQueryOptions,
      filters: [{ field: 'storeId', value: `${storeId}` }],
    };
    const products$ = this.productsService.getProducts(productsQuery);

    combineLatest([products$])
      .pipe(
        take(1),
        map(([products]) => {
          this.products = products;
          this.updateAllProductOptions();
        })
      )
      .subscribe();
  }

  loadDiscounts() {
    const storeId = this.selectedStoreId();
    if (storeId === null) return;

    const discountsQuery = {
      ...this.defaultQueryOptions,
      filters: [{ field: 'storeId', value: `${storeId}` }],
    };
    const discounts$ = this.discountsService.getDiscounts(discountsQuery);

    combineLatest([discounts$])
      .pipe(
        take(1),
        map(([discounts]) => {
          this.discounts = discounts;
          this.updateAllDiscountOptions();
        })
      )
      .subscribe();
  }

  onStoreSelectedChanged(store: Store | string) {
    if (store === null || store === undefined) return;

    const storeId = (store as Store).id;

    // Make sure fields that depends on store are enabled
    this.formGroup.controls['discount'].enable();
    this.formGroup.controls['items'].enable();

    this.selectedStoreId.set(storeId as Store['id']);

    this.loadProducts();
    this.loadDiscounts();
  }

  onProductSelectedChanged(
    index: number,
    productId: Maybe<Product['id'] | string>
  ) {
    const { discountId, quantity, wasRefunded } =
      this.transactionItemsFormArray.controls[index].value;
    this.selectedProductIdsState.update((state) => ({
      ...state,
      [index]: productId as Product['id'],
    }));
    this.recomputeTransactionItemPrices(
      index,
      productId ? +productId : null,
      quantity,
      discountId,
      wasRefunded
    );
    this.updateAllProductOptions(index);
  }

  onDiscountSelectedChanged(
    index: number,
    discountId: Maybe<DiscountDetail['id'] | string>
  ) {
    const { productId, quantity, wasRefunded } =
      this.transactionItemsFormArray.controls[index].value;
    this.recomputeTransactionItemPrices(
      index,
      productId,
      quantity,
      discountId ? +discountId : null,
      wasRefunded
    );
  }

  onQuantityChanged(index: number, quantity: number) {
    const { productId, discountId, wasRefunded } =
      this.transactionItemsFormArray.controls[index].value;
    this.recomputeTransactionItemPrices(
      index,
      productId,
      quantity,
      discountId,
      wasRefunded
    );
  }

  onWasRefundedChanged(index: number, change: MatSlideToggleChange) {
    const { discountId, quantity, productId } =
      this.transactionItemsFormArray.controls[index].value;

    const wasRefunded = change.checked;
    this.recomputeTransactionItemPrices(
      index,
      productId,
      quantity,
      discountId,
      wasRefunded
    );
  }

  recomputeTransactionItemPrices(
    index: number,
    productId: Maybe<Product['id']>,
    quantity: Maybe<number>,
    discountId: Maybe<DiscountDetail['id']>,
    wasRefunded: boolean
  ) {
    if (
      typeof productId !== 'number' ||
      typeof quantity !== 'number' ||
      !this.products ||
      !this.discounts ||
      this.products.length === 0
    ) {
      return;
    }

    const selectedProduct = this.products.find((p) => p.id === productId);
    const selectedDiscount = discountId
      ? this.discounts.find((d) => d.id === discountId)
      : null;

    if (!selectedProduct) {
      throw new Error(`No product with ID ${productId} found.`);
    }

    const unitPrice = selectedProduct.price;
    const salePrice = unitPrice * quantity;
    const discountAmount = selectedDiscount
      ? selectedDiscount.type === DiscountType.PERCENTAGE
        ? salePrice * selectedDiscount.value
        : selectedDiscount.value
      : 0;
    const refundAmount = wasRefunded ? salePrice - discountAmount : 0;
    const netSales = salePrice - refundAmount - discountAmount;

    this.unitPricesState.update((state) => ({
      ...state,
      [index]: unitPrice,
    }));
    this.salePricesState.update((state) => ({
      ...state,
      [index]: salePrice,
    }));
    this.discountPricesState.update((state) => ({
      ...state,
      [index]: discountAmount,
    }));
    this.refundPricesState.update((state) => ({
      ...state,
      [index]: refundAmount,
    }));
    this.netSalesPricesState.update((state) => ({
      ...state,
      [index]: netSales,
    }));
    this.totalPricesState.update((state) => ({
      ...state,
      [index]: netSales,
    }));
    this.originalTotalPricesState.update((state) => {
      if (discountAmount > 0) {
        return {
          ...state,
          [index]: salePrice,
        };
      } else {
        const stateCopy = { ...state };
        delete stateCopy[index];
        return stateCopy;
      }
    });

    this.recomputeTotalRowAmounts();
  }

  recomputeTotalRowAmounts() {
    this.saleAmount.set(
      Object.values(this.salePricesState()).reduce((acc, p) => acc + p, 0)
    );
    this.discountAmount.set(
      Object.values(this.discountPricesState()).reduce((acc, p) => acc + p, 0)
    );
    this.refundsAmount.set(
      Object.values(this.refundPricesState()).reduce((acc, p) => acc + p, 0)
    );
    this.subtotalAmount.set(
      Object.values(this.netSalesPricesState()).reduce((acc, p) => acc + p, 0)
    );
  }

  updateAllDiscountOptions() {
    this.discountOptionsState.set(
      (this.discounts ?? []).map((d) => ({ label: d.code, value: d }))
    );
    this.discountIdOptionsState.set(
      (this.discounts ?? []).map((d) => ({ label: d.code, value: d.id }))
    );
  }

  updateAllProductOptions(except?: Product['id']) {
    for (
      let index = 0;
      index < this.transactionItemsFormArray.controls.length;
      index++
    ) {
      if (index !== except) {
        this.updateProductOptions(index);
      }
    }
  }

  updateProductOptions(index: number) {
    const productIdAtIndex =
      this.transactionItemsFormArray.controls[index].value['productId'];
    const selectedProductIds = Object.values(this.selectedProductIdsState());
    const productOptions = this.allProductOptions.filter(
      (o) =>
        !selectedProductIds.includes(o.value) || o.value === productIdAtIndex
    );
    this.productOptionsState.update((state) => ({
      ...state,
      [index]: productOptions,
    }));
  }

  getUnitPrice(index: number) {
    return index in this.unitPricesState()
      ? this.unitPricesState()[index]
      : undefined;
  }

  getTotalPrice(index: number) {
    return index in this.totalPricesState()
      ? this.totalPricesState()[index]
      : undefined;
  }

  getOriginalTotalPrice(index: number) {
    return index in this.originalTotalPricesState()
      ? this.originalTotalPricesState()[index]
      : undefined;
  }

  getProductOptions(index: number) {
    return index in this.productOptionsState()
      ? this.productOptionsState()[index]
      : [];
  }

  handleAddProductButtonClicked(event: MouseEvent) {
    event.preventDefault();
    this.addTransactionItemControls();
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

    if (this.mode === 'create') {
      this.createTransaction();
    } else {
      this.updateTransaction();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `${this.mode} transaction cancelled.`);
  }

  openNotePanel(index: number) {
    this.notePanelsState.update((state) => ({ ...state, [index]: true }));
  }

  closeNotePanel(index: number) {
    this.notePanelsState.update((state) => ({ ...state, [index]: false }));
  }

  isNotePanelExpanded(index: number) {
    return this.notePanelsState()[index];
  }

  getTransactionItem(index: number) {
    if (!this.transaction) return null;
    return this.transaction.items.length > index
      ? this.transaction.items[index]
      : null;
  }

  private createTransaction() {
    const transactionData = this.formGroup.value;
    const transaction: TransactionCreateData = {
      customer:
        transactionData['customer'] === 'walk-in'
          ? null
          : transactionData['customer'],
      store: transactionData['store'],
      user: transactionData['staff'],
      discount: transactionData['discount'],
      serviceChargeRate: transactionData['serviceChargePercent']
        ? transactionData['serviceChargePercent'] / 100
        : null,
      tip: transactionData['tip'],
      salesTaxRate: transactionData['salesTaxPercent'] / 100,
      paymentType: transactionData['paymentType'],
      status: transactionData['status'],
      transactionType: transactionData['type'],
      transactionDate: transactionData['transactionDate'],
      note: transactionData['note'],
      items: transactionData['items'],
    };

    this.disableForm();

    this.transactionsService
      .createTransaction(transaction)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private updateTransaction() {
    if (!this.transaction) {
      console.error('No transaction to update.');
      return;
    }

    const transactionData = this.formGroup.value;
    const transaction: TransactionUpdateData = {
      id: this.transaction.id,
      customer:
        transactionData['customer'] === 'walk-in'
          ? null
          : transactionData['customer'],
      store: transactionData['store'],
      user: transactionData['staff'],
      discount: transactionData['discount'],
      serviceChargeRate: transactionData['serviceChargePercent']
        ? transactionData['serviceChargePercent'] / 100
        : null,
      tip: transactionData['tip'],
      salesTaxRate: transactionData['salesTaxPercent'] / 100,
      paymentType: transactionData['paymentType'],
      status: transactionData['status'],
      transactionType: transactionData['type'],
      transactionDate: transactionData['transactionDate'],
      note: transactionData['note'],
      items: transactionData['items'],
    };

    this.disableForm();

    this.transactionsService
      .updateTransaction(transaction)
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
      this.mode === 'create' ? 'transaction created!' : 'transaction updated!'
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

    // Allow user to close dialog
    this.dialogRef.disableClose = false;
  }

  private disableForm() {
    for (const control of Object.values(this.formGroup.controls)) {
      control.disable();
    }
  }

  private enableForm() {
    for (const [name, control] of Object.entries(this.formGroup.controls)) {
      if (
        this.selectedStoreId() === null &&
        (name === 'discount' || name === 'items')
      ) {
        control.disable();
        continue;
      }
      control.enable();
    }
  }
}
