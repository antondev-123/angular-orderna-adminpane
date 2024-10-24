import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonComponent } from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import {
  PAYMENT_TYPE_OPTIONS,
  PaymentType,
} from '@orderna/admin-panel/src/app/model/enum/payment-type';

@Component({
  selector: 'app-payment-options-dialog',
  templateUrl: './payment-options-dialog.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonComponent, MatDialogModule],
  standalone: true,
})
export class PaymentOptionsDialogComponent {
  #dialogRef = inject(MatDialogRef);
  protected readonly OPTIONS = PAYMENT_TYPE_OPTIONS;

  #currentPaymentType = inject(MAT_DIALOG_DATA) as PaymentType;
  selectedOption = signal(this.#currentPaymentType);

  apply(): void {
    this.#dialogRef.close(this.selectedOption());
  }

  close(): void {
    this.#dialogRef.close();
  }
}
