import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { InputTextComponent } from '../../input/text/text.component';
import { InputEmailComponent } from '../../input/email/email.component';
import { InputSelectComponent } from '../../input/select/select.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { take } from 'rxjs';
import { LoaderService } from '@orderna/admin-panel/src/app/services/shared/loader/loader.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Product } from '@orderna/admin-panel/src/app/model/product';
import { MatIconModule } from '@angular/material/icon';
import { ProductsApiService } from '@orderna/admin-panel/src/app/services/products/products-api.service';
@Component({
  selector: 'app-product-confirm-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    InputTextComponent,
    InputEmailComponent,
    InputSelectComponent,
    ButtonComponent,
    ButtonTextDirective,
    ReactiveFormsModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './product-confirm-delete-modal.component.html',
  styleUrl: '../modal.component.scss',
})
export class ProductConfirmDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get product() {
    return this.data.product;
  }

  constructor(
    private dialogRef: MatDialogRef<ProductConfirmDeleteModalComponent>,
    private loaderService: LoaderService,
    private productsService: ProductsApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      product: Maybe<any>;
      storeId: number;
      categoryId: number;
    }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    this.deleteUser();
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ? result : undefined);
  }

  private deleteUser() {
    if (!this.product) {
      console.error('No product to delete.');
      return;
    }
    const productIdsToDelete = [this.product.productId];
    this.productsService
      .deleteProducts(this.data.storeId, this.data.categoryId,productIdsToDelete)
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
