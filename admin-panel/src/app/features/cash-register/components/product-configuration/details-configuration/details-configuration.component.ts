import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OrderProduct } from '@orderna/admin-panel/src/app/services/shared/order/order-product';

@Component({
  selector: 'app-details-configuration',
  templateUrl: './details-configuration.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsConfigurationComponent {
  orderedProduct = input.required<OrderProduct>();

  #dialogRef = inject(MatDialogRef);

  form = new FormGroup({
    newPrice: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(1),
    ]),
    quantity: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(1),
    ]),
    note: new FormControl<string>(''),
  });

  initForm = effect(() => {
    const orderedProduct = this.orderedProduct();
    this.form.patchValue({
      newPrice: orderedProduct.price,
      quantity: orderedProduct.quantity,
      note: orderedProduct.note,
    });
  });

  close(): void {
    this.#dialogRef.close();
  }

  apply(): void {
    if (this.form.invalid) {
      return;
    }

    const orderProduct = this.orderedProduct();

    if (orderProduct.price !== this.form.value.newPrice) {
      orderProduct.newPrice = this.form.value.newPrice!;
    }

    orderProduct.quantity = this.form.value.quantity!;
    orderProduct.note = this.form.value.note!;
    this.#dialogRef.close(orderProduct);
  }
}
