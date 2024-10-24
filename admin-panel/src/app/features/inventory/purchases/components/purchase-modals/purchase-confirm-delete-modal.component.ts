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
} from '../../../../../shared/components/button/button.component';

import { Purchase } from '../../../../../model/purchase';
import { LoaderService } from '../../../../../services/shared/loader/loader.service';
import { PurchasesApiService } from '../../../../../services/purchases/purchases-api.service';

@Component({
  selector: 'app-purchase-confirm-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './purchase-confirm-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class PurchaseConfirmDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get purchases() {
    return this.data.purchase;
  }

  constructor(
    private dialogRef: MatDialogRef<PurchaseConfirmDeleteModalComponent>,
    private loaderService: LoaderService,
    private purchasesService: PurchasesApiService,
    @Inject(MAT_DIALOG_DATA) public data: { purchase: Maybe<Purchase> }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    this.deletePurchases();
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Delete purchase cancelled.`);
  }

  private deletePurchases() {
    if (!this.purchases) {
      console.error('No purchase to delete.');
      return;
    }

    this.purchasesService
      .deletePurchase(this.purchases.id)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog('purchase deleted!');
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
