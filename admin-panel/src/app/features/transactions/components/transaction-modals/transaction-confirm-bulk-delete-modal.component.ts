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
import { take } from 'rxjs';

@Component({
  selector: 'app-modal-transaction-confirm-bulk-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './transaction-confirm-bulk-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class TransactionConfirmBulkDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get transactionsToDeleteCount() {
    return this.data.transactionsToDeleteCount;
  }

  get selectAll() {
    return this.data.selectAll;
  }

  get selectedTransactions() {
    return this.data.selectedTransactions;
  }

  constructor(
    private dialogRef: MatDialogRef<TransactionConfirmBulkDeleteModalComponent>,
    private loaderService: LoaderService,
    private transactionsService: TransactionsApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      transactionsToDeleteCount: number;
      selectAll: boolean;
      selectedTransactions: Transaction['id'][];
    }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent transaction from closing dialog
    this.dialogRef.disableClose = true;

    if (this.selectAll) {
      if (this.selectedTransactions.length > 0) {
        this.deleteAllTransactionsExcept();
      } else {
        this.deleteAllTransactions();
      }
    } else if (this.selectedTransactions.length > 0) {
      this.deleteTransactions();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Bulk delete transactions cancelled.`);
  }

  private deleteTransactions() {
    this.transactionsService
      .deleteTransactions(this.selectedTransactions)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllTransactions() {
    this.transactionsService
      .deleteAllTransactions()
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllTransactionsExcept() {
    this.transactionsService
      .deleteAllTransactionsExcept(this.selectedTransactions)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(`${this.transactionsToDeleteCount} transactions deleted!`);
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
