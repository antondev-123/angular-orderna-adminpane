import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../shared/components/button/button.component';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { Supplier } from '../../../../model/supplier';
import { take } from 'rxjs';
import { SuppliersApiService } from '../../../../services/suppliers/suppliers-api.service';

@Component({
  selector: 'app-supplier-confirm-bulk-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './supplier-confirm-bulk-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class SupplierConfirmBulkDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;
  errorMessage: string = '';

  get suppliersToDeleteCount() {
    return this.data.suppliersToDeleteCount;
  }

  get selectAll() {
    return this.data.selectAll;
  }

  get selectedSuppliers() {
    return this.data.selectedSuppliers;
  }

  constructor(
    private dialogRef: MatDialogRef<SupplierConfirmBulkDeleteModalComponent>,
    private loaderService: LoaderService,
    private suppliersService: SuppliersApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      suppliersToDeleteCount: number;
      selectAll: boolean;
      selectedSuppliers: Supplier['id'][];
    }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent supplier from closing dialog
    this.dialogRef.disableClose = true;

    if (this.selectAll) {
      if (this.selectedSuppliers.length > 0) {
        this.deleteAllSuppliersExcept();
      } else {
        this.deleteAllSuppliers();
      }
    } else if (this.selectedSuppliers.length > 0) {
      this.deleteSuppliers();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Bulk delete users cancelled.`);
  }

  private deleteSuppliers() {
    this.suppliersService
      .deleteSuppliers(this.selectedSuppliers)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllSuppliers() {
    this.suppliersService
      .deleteAllSuppliers()
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllSuppliersExcept() {
    this.suppliersService
      .deleteAllSuppliersExcept(this.selectedSuppliers)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(`${this.suppliersToDeleteCount} users deleted!`);
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
