import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DiscountDetail } from '@orderna/admin-panel/src/app/model/discount';
import { DiscountType } from '@orderna/admin-panel/src/app/model/enum/discount-type';

function fixedDiscountValidator(price: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value >= price) {
      return { invalidDiscount: 'Amount must be less than ' + price };
    }

    return null;
  };
}

function percentageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if ((control.value && control.value < 1) || control.value > 99) {
      return { invalidDiscount: 'Invalid percentage' };
    }

    return null;
  };
}

@Component({
  selector: 'app-discount-form',
  templateUrl: './discount-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountFormComponent {
  readonly DiscountType = DiscountType;
  discount = input.required<DiscountDetail | undefined | null>();
  type = signal(DiscountType.FIXED);
  maxDiscount = input.required<number>();
  applyDiscount = output<DiscountDetail | null>();

  #matDialogRef = inject(MatDialogRef);

  discountForm = new FormGroup({
    value: new FormControl<number | undefined>(undefined),
  });

  #initControl = effect(
    () => {
      const discount = this.discount();

      if (discount) {
        this.type.set(discount.type);
        this.discountForm.controls.value.setValue(discount.value);
      }
    },
    { allowSignalWrites: true }
  );

  #intValidator = effect(() => {
    const type = this.type();
    const discountValueControl = this.discountForm.controls.value;

    if (type === DiscountType.FIXED) {
      discountValueControl.addValidators(
        fixedDiscountValidator(this.maxDiscount())
      );
    }

    if (type == DiscountType.PERCENTAGE) {
      discountValueControl.addValidators(percentageValidator());
    }
  });

  toggle(type: DiscountType): void {
    const discountValueControl = this.discountForm.controls.value;
    discountValueControl.reset();
    discountValueControl.clearValidators();
    this.type.set(type);
  }

  apply(): void {
    if (this.discountForm.invalid) {
      return;
    }

    this.applyDiscount.emit(
      DiscountDetail.fromJSON({
        type: this.type(),
        value: this.discountForm.controls.value.value!,
      })
    );
  }

  deleteDiscount(): void {
    this.applyDiscount.emit(null);
  }

  close(): void {
    this.#matDialogRef.close();
  }
}
