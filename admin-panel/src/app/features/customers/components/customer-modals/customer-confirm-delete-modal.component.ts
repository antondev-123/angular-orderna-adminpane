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
import { Customer } from '../../../../model/customer';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { take } from 'rxjs';
import { CustomersApiService } from '../../../../services/customers/customers-api.service';

@Component({
  selector: 'app-modal-customer-confirm-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './customer-confirm-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class CustomerConfirmDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get customer() {
    return this.data.customer;
  }

  constructor(
    private dialogRef: MatDialogRef<CustomerConfirmDeleteModalComponent>,
    private loaderService: LoaderService,
    private customersService: CustomersApiService,
    @Inject(MAT_DIALOG_DATA) public data: { customer: Maybe<Customer> }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent customer from closing dialog
    this.dialogRef.disableClose = true;

    this.deleteCustomer();
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Delete customer cancelled.`);
  }

  private deleteCustomer() {
    if (!this.customer) {
      console.error('No customer to delete.');
      return;
    }

    this.customersService
      .deleteCustomer(this.customer.id)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog('customer deleted!');
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
