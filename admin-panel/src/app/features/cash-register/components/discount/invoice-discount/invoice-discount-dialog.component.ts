import { DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonComponent } from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { DiscountFormComponent } from '../discount-form/discount-form.component';
import { DiscountDetail } from '@orderna/admin-panel/src/app/model/discount';

@Component({
  selector: 'app-invoice-discount-dialog',
  templateUrl: './invoice-discount-dialog.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonComponent, MatDialogModule, DiscountFormComponent],
})
export class InvoiceDiscountDialogComponent {
  #dialogRef = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA) as {
    discount: DiscountDetail;
    maxDiscount: number;
  };

  close(): void {
    this.#dialogRef.close();
  }

  apply(discount: DiscountDetail | null) {
    this.#dialogRef.close(discount);
  }
}
