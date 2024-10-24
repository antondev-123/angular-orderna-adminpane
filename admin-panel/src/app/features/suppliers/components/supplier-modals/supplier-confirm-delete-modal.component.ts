import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { take } from 'rxjs';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../shared/components/button/button.component';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { Supplier } from '../../../../model/supplier';
import { SuppliersApiService } from '../../../../services/suppliers/suppliers-api.service';

@Component({
  selector: 'app-supplier-confirm-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './supplier-confirm-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class SupplierConfirmDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get supplier() {
    return this.data.supplier;
  }

  constructor(
    private dialogRef: MatDialogRef<SupplierConfirmDeleteModalComponent>,
    private loaderService: LoaderService,
    private suppliersService: SuppliersApiService,
    @Inject(MAT_DIALOG_DATA) public data: { supplier: Maybe<Supplier> }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    this.deleteSupplier();
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Delete supplier cancelled.`);
  }

  private deleteSupplier() {
    if (!this.supplier) {
      console.error('No supplier to delete.');
      return;
    }

    this.suppliersService
      .deleteSupplier(this.supplier.id)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog('user deleted!');
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
