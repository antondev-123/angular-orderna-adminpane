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
import { DiscountSummary } from '../../../../model/discount';
import { take } from 'rxjs';
import { DiscountsApiService } from '../../../../services/discounts/discounts-api.service';

@Component({
  selector: 'app-modal-discount-confirm-bulk-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './discount-confirm-bulk-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class DiscountConfirmBulkDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get discountsToDeleteCount() {
    return this.data.discountsToDeleteCount;
  }

  get selectAll() {
    return this.data.selectAll;
  }

  get selectedDiscounts() {
    return this.data.selectedDiscounts;
  }

  constructor(
    private dialogRef: MatDialogRef<DiscountConfirmBulkDeleteModalComponent>,
    private loaderService: LoaderService,
    private discountsService: DiscountsApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      discountsToDeleteCount: number;
      selectAll: boolean;
      selectedDiscounts: DiscountSummary['id'][];
    }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent discount from closing dialog
    this.dialogRef.disableClose = true;

    if (this.selectAll) {
      if (this.selectedDiscounts.length > 0) {
        this.deleteAllDiscountsExcept();
      } else {
        this.deleteAllDiscounts();
      }
    } else if (this.selectedDiscounts.length > 0) {
      this.deleteDiscounts();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Bulk delete discounts cancelled.`);
  }

  private deleteDiscounts() {
    this.discountsService
      .deleteDiscounts(this.selectedDiscounts)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllDiscounts() {
    this.discountsService
      .deleteAllDiscounts()
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllDiscountsExcept() {
    this.discountsService
      .deleteAllDiscountsExcept(this.selectedDiscounts)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(`${this.discountsToDeleteCount} discounts deleted!`);
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

    // Allow discount to close dialog
    this.dialogRef.disableClose = false;
  }
}
