import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { ProductConfirmDeleteModalComponent } from '@orderna/admin-panel/src/app/shared/components/modal/products/product-confirm-delete-modal.component';
import { Category } from '@orderna/admin-panel/src/app/model/category';
import { CategoriesApiService } from '@orderna/admin-panel/src/app/services/categories/categories-api.service';
import { LoaderService } from '@orderna/admin-panel/src/app/services/shared/loader/loader.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-category-confirm-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  templateUrl: './category-confirm-delete-modal.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
    './category-confirm-delete-modal.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryConfirmDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get category() {
    return this.data.category;
  }

  constructor(
    private dialogRef: MatDialogRef<ProductConfirmDeleteModalComponent>,
    private loaderService: LoaderService,
    private categoriesService: CategoriesApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      category: Category;
    }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    this.deleteCategory();
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ? result : undefined);
  }

  private deleteCategory() {
    if (!this.category) {
      console.error('No category to delete.');
      return;
    }

    this.categoriesService
      .deleteCategory(this.data.category?.categoryId)
      .pipe(take(1))
      .subscribe({
        next: (result) => this.handleSuccess(result),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess(result: any) {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(result);
    this.reset();
  }

  private handleError(err: any) {
    this.success = false;
    this.errorMessage = (err as Error).message;
    this.reset();
  }

  private reset(): void {
    // Reset loading states
    this.loading = false;
    this.loaderService.setLoading(false);

    // Allow user to close dialog
    this.dialogRef.disableClose = false;
  }
}
