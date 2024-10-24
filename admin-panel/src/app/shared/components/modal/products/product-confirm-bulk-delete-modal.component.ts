import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { take } from 'rxjs';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from '@orderna/admin-panel/src/app/services/shared/loader/loader.service';
import { Product } from '@orderna/admin-panel/src/app/model/product';
import { ProductsApiService } from '@orderna/admin-panel/src/app/services/products/products-api.service';

@Component({
  selector: 'app-product-confirm-bulk-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    ButtonComponent,
    ButtonTextDirective,
    ReactiveFormsModule,
    MatIconModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './product-confirm-bulk-delete-modal.component.html',
  styleUrl: '../modal.component.scss',
})
export class ProductConfirmBulkDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get productsToDeleteCount() {
    return this.data.productToDeleteCount;
  }

  get selectAll() {
    return this.data.selectAll;
  }

  get selectedProducts() {
    return this.data.selectedProducts;
  }

  constructor(
    private dialogRef: MatDialogRef<ProductConfirmBulkDeleteModalComponent>,
    private loaderService: LoaderService,
    private productsService: ProductsApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      storeId: number;
      categoryId: number;
      productToDeleteCount: number;
      selectAll: boolean;
      selectedProducts: Product['productId'][];
    }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent products from closing dialog
    this.dialogRef.disableClose = true;

    if (this.selectAll) {
        this.deleteAllProducts();
      }
    else if (this.selectedProducts.length > 0) {
      this.deleteProducts();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ? result : undefined);
  }

  private deleteProducts() {
    this.productsService
      .deleteProducts(
        this.data.storeId,
        this.data.categoryId,
        this.selectedProducts
      )
      .pipe(take(1))
      .subscribe({
        next: (results) => this.handleSuccess(results),
        error: (err: any) => this.handleError(err),
      });
  }

  private deleteAllProducts() {
    this.productsService
      .deleteProducts(
        this.data.storeId,
        this.data.categoryId,
        this.selectedProducts
      )
      .pipe(take(1))
      .subscribe({
        next: (results) => this.handleSuccess(results),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllProductExcept() {
    this.productsService
      .deleteAllProductExcept(
        this.data.storeId,
        this.data.categoryId,
        this.selectedProducts
      )
      .pipe(take(1))
      .subscribe({
        next: (results) => this.handleSuccess(results),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess(results: any) {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(results);
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

    // Allow product to close dialog
    this.dialogRef.disableClose = false;
  }
}
