import { Component, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonComponent } from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { OrderProduct } from '@orderna/admin-panel/src/app/services/shared/order/order-product';

@Component({
  selector: 'app-quantity-choosing-dialog',
  templateUrl: './quantity-choosing-dialog.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonComponent, MatDialogModule, ReactiveFormsModule],
})
export class QuantityChoosingDialogComponent {
  #dialogRef = inject(MatDialogRef);
  data: OrderProduct = inject(MAT_DIALOG_DATA);

  formControl = new FormControl<number>(this.data.quantity || 1, [
    Validators.required,
  ]);

  close(): void {
    this.#dialogRef.close();
  }

  apply(): void {
    if (this.formControl.invalid) {
      return;
    }

    this.data.quantity = this.formControl.value!;
    this.#dialogRef.close(this.data);
  }
}
