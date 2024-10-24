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
} from '../../../../../shared/components/button/button.component';

import { take } from 'rxjs';
import { Purchase } from '../../../../../model/purchase';
import { LoaderService } from '../../../../../services/shared/loader/loader.service';
import { PurchasesApiService } from '../../../../../services/purchases/purchases-api.service';

@Component({
  selector: 'app-purchase-confirm-bulk-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './purchase-confirm-bulk-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class PurchaseConfirmBulkDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;
  errorMessage: string = '';

  get purchaseToDeleteCount() {
    return this.data.purchaseToDeleteCount;
  }

  get selectAll() {
    return this.data.selectAll;
  }

  get selectedPurchasesitems() {
    return this.data.selectedPurchases;
  }

  constructor(
    private dialogRef: MatDialogRef<PurchaseConfirmBulkDeleteModalComponent>,
    private loaderService: LoaderService,
    private purchasesService: PurchasesApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      purchaseToDeleteCount: number;
      selectAll: boolean;
      selectedPurchases: Purchase['id'][];
    }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent purchase from closing dialog
    this.dialogRef.disableClose = true;

    if (this.selectAll) {
      if (this.selectedPurchasesitems.length > 0) {
        this.deleteAllPurchasesExcept();
      } else {
        this.deleteAllPurchases();
      }
    } else if (this.selectedPurchasesitems.length > 0) {
      this.deletePurchase();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Bulk delete purchase cancelled.`);
  }

  private deletePurchase() {
    this.purchasesService
      .deletePurchases(this.selectedPurchasesitems)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllPurchases() {
    this.purchasesService
      .deleteAllPurchases()
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllPurchasesExcept() {
    this.purchasesService
      .deleteAllPurchasesExcept(this.selectedPurchasesitems)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(`${this.purchaseToDeleteCount} purchase deleted!`);
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

    // Allow purchase to close dialog
    this.dialogRef.disableClose = false;
  }
}
