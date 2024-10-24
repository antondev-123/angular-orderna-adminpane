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
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { Transaction } from '@orderna/admin-panel/src/app/model/transaction';
import { LoaderService } from '@orderna/admin-panel/src/app/services/shared/loader/loader.service';
import { TransactionsApiService } from '@orderna/admin-panel/src/app/services/transactions/transactions-api.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { take } from 'rxjs';

@Component({
  selector: 'app-modal-transaction-confirm-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './transaction-confirm-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class TransactionConfirmDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get transaction() {
    return this.data.transaction;
  }

  constructor(
    private dialogRef: MatDialogRef<TransactionConfirmDeleteModalComponent>,
    private loaderService: LoaderService,
    private transactionsService: TransactionsApiService,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: Maybe<Transaction> }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent transaction from closing dialog
    this.dialogRef.disableClose = true;

    this.deleteTransaction();
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Delete transaction cancelled.`);
  }

  private deleteTransaction() {
    if (!this.transaction) {
      console.error('No transaction to delete.');
      return;
    }

    this.transactionsService
      .deleteTransaction(this.transaction.id)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog('transaction deleted!');
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

    // Allow transaction to close dialog
    this.dialogRef.disableClose = false;
  }
}
