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
import { DiscountSummary } from '../../../../model/discount';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { take } from 'rxjs';
import { DiscountsApiService } from '../../../../services/discounts/discounts-api.service';

@Component({
  selector: 'app-modal-discount-confirm-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './discount-confirm-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class DiscountConfirmDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get discount() {
    return this.data.discount;
  }

  constructor(
    private dialogRef: MatDialogRef<DiscountConfirmDeleteModalComponent>,
    private loaderService: LoaderService,
    private discountsService: DiscountsApiService,
    @Inject(MAT_DIALOG_DATA) public data: { discount: Maybe<DiscountSummary> }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent discount from closing dialog
    this.dialogRef.disableClose = true;

    this.deleteDiscount();
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Delete discount cancelled.`);
  }

  private deleteDiscount() {
    if (!this.discount) {
      console.error('No discount to delete.');
      return;
    }

    this.discountsService
      .deleteDiscount(this.discount.id)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog('discount deleted!');
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
