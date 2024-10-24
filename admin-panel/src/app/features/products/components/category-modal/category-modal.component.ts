import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, Inject } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { InputTextComponent } from '@orderna/admin-panel/src/app/shared/components/input/text/text.component';
import { InputTextAreaComponent } from '@orderna/admin-panel/src/app/shared/components/input/textarea/textarea.component';
import {
  Category,
  CategoryCreateData,
} from '@orderna/admin-panel/src/app/model/category';
import { CategoriesApiService } from '@orderna/admin-panel/src/app/services/categories/categories-api.service';
import { LoaderService } from '@orderna/admin-panel/src/app/services/shared/loader/loader.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    InputTextComponent,
    InputTextAreaComponent,
    ButtonComponent,
    ButtonTextDirective,
    ReactiveFormsModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './category-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class CategoryModalComponent {
  Validators = Validators;

  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';
  formGroup!: FormGroup;

  get mode() {
    return this.data.mode || 'create';
  }

  get category() {
    return this.data?.category;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CategoryModalComponent>,
    private loaderService: LoaderService,
    private categoriesService: CategoriesApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({});
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
    const categoryData = this.formGroup.value;
    const category: Category = {
      name: categoryData['name'],
      description: categoryData['description'],
      products: [],
    };

    this.disableForm();
    if (this.mode === 'create') {
      this.createCategory(category);
    } else {
      this.updateCategory(category);
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result);
  }

  private createCategory(data: CategoryCreateData) {
    console.log(data,"Category data");
    let categoryData = {
      name : data.name,
      description : data.description,
      storeId : this.data.storeId
    }
    this.categoriesService
      .createCategory(categoryData)
      .pipe(take(1))
      .subscribe({
        next: (res) => this.handleSuccess(res),
        error: (err) => this.handleError(err),
      });
  }

  private updateCategory(data: CategoryCreateData) {
    let categoryData = {
      name : data.name,
      description : data.description,
    }
    this.categoriesService
      .updateCategory(categoryData,this.category.categoryId)
      .pipe(take(1))
      .subscribe({
        next: (res) => this.handleSuccess(res),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess(res: any): void {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(res);
    this.reset();
  }

  private handleError(err: any): void {
    this.success = false;
    this.errorMessage = (err as Error).message;
    this.closeDialog();
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
    for (const control of Object.values(this.formGroup.controls)) {
      control.enable();
    }
  }
}
