import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../shared/components/button/button.component';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { Customer } from '../../../../model/customer';
import { take } from 'rxjs';
import { CustomersApiService } from '../../../../services/customers/customers-api.service';

@Component({
  selector: 'app-modal-customer-confirm-bulk-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './customer-confirm-bulk-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class CustomerConfirmBulkDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get customersToDeleteCount() {
    return this.data.customersToDeleteCount;
  }

  get selectAll() {
    return this.data.selectAll;
  }

  get selectedCustomers() {
    return this.data.selectedCustomers;
  }

  constructor(
    private dialogRef: MatDialogRef<CustomerConfirmBulkDeleteModalComponent>,
    private loaderService: LoaderService,
    private customersService: CustomersApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      customersToDeleteCount: number;
      selectAll: boolean;
      selectedCustomers: Customer['id'][];
    }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent customer from closing dialog
    this.dialogRef.disableClose = true;

    if (this.selectAll) {
      if (this.selectedCustomers.length > 0) {
        this.deleteAllCustomersExcept();
      } else {
        this.deleteAllCustomers();
      }
    } else if (this.selectedCustomers.length > 0) {
      this.deleteCustomers();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Bulk delete customers cancelled.`);
  }

  private deleteCustomers() {
    this.customersService
      .deleteCustomers(this.selectedCustomers)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllCustomers() {
    this.customersService
      .deleteAllCustomers()
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllCustomersExcept() {
    this.customersService
      .deleteAllCustomersExcept(this.selectedCustomers)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(`${this.customersToDeleteCount} customers deleted!`);
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

    // Allow customer to close dialog
    this.dialogRef.disableClose = false;
  }
}
