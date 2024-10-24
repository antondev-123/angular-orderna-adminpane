import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
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
  ModifierGroup,
  ModifierGroupCreateData,
  ModifierGroupUpdateData,
} from '../../../../../model/modifier-group';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../../shared/components/button/button.component';
import { InputNumberComponent } from '../../../../../shared/components/input/number/number.component';
import { InputSelectComponent } from '../../../../../shared/components/input/select/select.component';
import { InputTextComponent } from '../../../../../shared/components/input/text/text.component';
import { InputTextAreaComponent } from '../../../../../shared/components/input/textarea/textarea.component';
import { DashedBorderAddButtonComponent } from '../../../../../shared/components/button/dashed-border-add-button/dashed-border-add-button.component';
import { ModifierOption } from '../../../../../model/modifier-option';
import { Store } from '../../../../../model/store';
import { FilterOptionItem } from '@orderna/admin-panel/src/types/filter';
import { Product } from '../../../../../model/product';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, take } from 'rxjs';
import { Category } from '../../../../../model/category';
import { ProductsApiService } from '../../../../../services/products/products-api.service';
import { CategoriesApiService } from '../../../../../services/categories/categories-api.service';

@Component({
  selector: 'app-modifier-group-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    ButtonTextDirective,
    DashedBorderAddButtonComponent,
    MatDialogModule,
    InputTextComponent,
    InputTextAreaComponent,
    InputSelectComponent,
    InputNumberComponent,
  ],
  templateUrl: './modifier-group-modal.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
    './modifier-group-modal.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifierGroupModalComponent implements OnInit, AfterViewInit {
  Validators = Validators;

  loading: boolean = false;
  success: boolean = false;
  isViewInitDone: boolean = false;

  errorMessage: string = '';
  formGroup!: FormGroup;

  categories$ = this.categoriesService.getCategoriesByStore(this.storeId);
  categories = toSignal<Category[], Category[]>(this.categories$, {
    initialValue: [],
  });
  categoryIdsSelected = signal<number[]>(this.modifierGroup?.categoryIds ?? []);
  categoryIdsSelected$ = toObservable(this.categoryIdsSelected);

  // NOTE: Used number instead of Category here because Category['id'] can be undefined
  //       which we don't want here
  categoryOptions = computed<FilterOptionItem<number>[]>(() => {
    return this.categories().reduce((acc: FilterOptionItem<number>[], c) => {
      if (typeof c.id === 'number') {
        acc.push({ label: c.name, value: c.id });
      }
      return acc;
    }, []);
  });

  products$ = this.categoryIdsSelected$.pipe(
    switchMap((categoryIds) =>
      this.productsService.listProductsByCategories(this.storeId, categoryIds)
    )
  );
  products = toSignal<Product[], Product[]>(this.products$, {
    initialValue: [],
  });
  productIdSelectedByRow = signal<(Product['id'] | undefined)[]>([]);
  productIdsSelected = computed<Product['id'][]>(() => {
    const ids: Product['id'][] = [];
    for (const id of this.productIdSelectedByRow()) {
      if (id !== undefined) {
        ids.push(id);
      }
    }
    return ids;
  });
  productOptionsByRow = computed<FilterOptionItem<Product['id']>[][]>(() => {
    const options: FilterOptionItem<Product['id']>[][] = [];
    // Loop through each row index
    for (
      let rowIndex = 0;
      rowIndex < this.productIdSelectedByRow().length;
      rowIndex++
    ) {
      // For each row, create a list of product options
      options.push(
        this.products().reduce((acc: FilterOptionItem<Product['id']>[], p) => {
          // Include product in this row's options if:
          // 1. It is the currently selected product for this row
          // 2. It is not selected in any other row
          // 3. And it is not the current product were trying to add/edit modifier group on
          if (
            (this.productIdSelectedByRow()[rowIndex] === p.id ||
              !this.productIdsSelected().includes(p.id)) &&
            this.productId !== p.id
          ) {
            acc.push({
              label: p.title,
              value: p.id,
            });
          }
          return acc;
        }, [])
      );
    }
    return options;
  });

  optionControlsDisabled = signal<boolean>(true);

  get optionsFormArray() {
    return this.formGroup.get('options') as FormArray;
  }

  get storeId() {
    return this.data.storeId;
  }

  get productId() {
    return this.data.productId;
  }

  get modifierGroup() {
    return this.data.modifierGroup;
  }

  get mode() {
    return this.modifierGroup ? 'edit' : 'create';
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ModifierGroupModalComponent>,
    private loaderService: LoaderService,
    private categoriesService: CategoriesApiService,
    private productsService: ProductsApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      storeId: Store['id'];
      productId: Product['id'];
      modifierGroup: Maybe<ModifierGroup>;
    }
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      options: this.formBuilder.array([]),
    });
    this.initOptionControls();
  }

  ngAfterViewInit() {
    this.isViewInitDone = true;
    this.toggleOptionControls();
  }

  initOptionControls() {
    if (this.modifierGroup) {
      for (const option of this.modifierGroup.options) {
        this.addOptionControls(option);
      }
    } else {
      this.addOptionControls();
    }
  }

  toggleOptionControls() {
    const categoryIds: number[] =
      this.formGroup.get('categoryIds')?.value ?? [];
    if (categoryIds.length > 0) {
      this.enableOptionControls();
    } else {
      this.disableOptionControls();
    }
  }

  enableOptionControls(): void {
    this.optionsFormArray.controls.forEach((control) => control.enable());
    this.optionControlsDisabled.set(false);
  }

  disableOptionControls(): void {
    this.optionsFormArray.controls.forEach((control) => control.disable());
    this.optionControlsDisabled.set(true);
  }

  resetOptionControls(): void {
    this.removeAllOptionControls();
    this.addOptionControls();
  }

  // NOTE: Used number instead of Category here because Category['id'] can be undefined
  //       which we don't want here
  onCategoriesSelectedChanged(categoryIds: number[]) {
    // Check if option control fields should be enabled/disabled
    this.toggleOptionControls();

    this.resetOptionControls();

    this.categoryIdsSelected.set(categoryIds ?? []);
  }

  onProductSelectedChanged(
    index: number,
    productId: Maybe<Product['id'] | string>
  ) {
    // Ensure productId is not nullish
    if (typeof productId !== 'number') {
      return;
    }

    // Update the productIdSelectedByRow list at the specified index
    this.productIdSelectedByRow.update((ids) => {
      // Create a new array to avoid mutating the state directly
      const newIds = [...ids];
      // Ensure the index is within bounds
      if (index >= 0 && index < newIds.length) {
        newIds[index] = productId;
      }
      return newIds;
    });
  }

  addOptionControls(option?: ModifierOption) {
    const optionControls = this.formBuilder.group({
      id: option?.id,
    });
    this.optionsFormArray.push(optionControls);

    this.productIdSelectedByRow.update((ids) => [...ids, option?.productId]);
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
      this.createModifierGroup();
    } else {
      this.updateModifierGroup();
    }
  }

  closeDialog(result?: ModifierGroup) {
    this.dialogRef.close(result);
  }

  getInitialModifierOption(index: number): ModifierOption | null {
    if (!this.modifierGroup || this.isViewInitDone) return null;

    const { options } = this.modifierGroup;

    // Ensure index is not out of bounds
    if (!(index >= 0 && index < options.length)) {
      throw new Error(
        `Index ${index} is out of bounds. Expected index to be within the range [0, ${
          options.length - 1
        }].`
      );
    }
    return this.modifierGroup.options[index];
  }

  private createModifierGroup() {
    const modifierGroupData = this.formGroup.value;
    const modifierGroup: ModifierGroupCreateData = {
      productId: this.productId,
      title: modifierGroupData['title'],
      skuPlu: modifierGroupData['skuPlu'],
      description: modifierGroupData['description'],
      categoryIds: modifierGroupData['categoryIds'],
      optionLimit: modifierGroupData['optionLimit'],
      options: modifierGroupData['options'],
    };
    this.disableForm();
    this.productsService
      .createModifierGroup(modifierGroup)
      .pipe(take(1))
      .subscribe({
        next: (result) => this.handleSuccess(result),
        error: (err) => this.handleError(err),
      });
  }

  private updateModifierGroup() {
    if (!this.modifierGroup) {
      console.error('No modifier group to update.');
      return;
    }

    const modifierGroupData = this.formGroup.value;
    const modifierGroup: ModifierGroupUpdateData = {
      id: this.modifierGroup.id,
      productId: this.productId,
      title: modifierGroupData['title'],
      skuPlu: modifierGroupData['skuPlu'],
      description: modifierGroupData['description'],
      categoryIds: modifierGroupData['categoryIds'],
      optionLimit: modifierGroupData['optionLimit'],
      options: modifierGroupData['options'],
    };
    this.disableForm();
    this.productsService
      .updateModifierGroup(modifierGroup)
      .pipe(take(1))
      .subscribe({
        next: (result) => this.handleSuccess(result),
        error: (err) => this.handleError(err),
      });
  }

  removeAllOptionControls() {
    this.optionsFormArray.controls.forEach((control) => control.reset());
    this.optionsFormArray.clear();
    this.productIdSelectedByRow.set([]);
  }

  removeOptionControls(index: number) {
    this.optionsFormArray.removeAt(index);

    this.productIdSelectedByRow.update((ids) =>
      ids.filter((_, i) => i !== index)
    );
  }

  handleAddOptionButtonClicked(event: MouseEvent) {
    event.preventDefault();
    this.addOptionControls();
  }

  trackOptionControl(index: number, control: AbstractControl<any, any>) {
    return uuidv4();
  }

  private handleSuccess(result: ModifierGroup): void {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(result);
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

    // Allow customer to close dialog
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
