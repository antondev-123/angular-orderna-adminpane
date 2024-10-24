import { DialogRef } from '@angular/cdk/dialog';
import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonComponent } from '@orderna/admin-panel/src/app/shared/components/button/button.component';

function cashReceivedValidator(charge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value < charge) {
      return { invalid: 'Cash received must be greater than charge' };
    }

    return null;
  };
}

@Component({
  selector: 'app-cash-change-dialog',
  templateUrl: './cash-change-dialog.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, MatDialogModule, ReactiveFormsModule, DecimalPipe],
})
export class CashChangeDialogComponent {
  #dialogRef = inject(MatDialogRef);

  charge = inject(MAT_DIALOG_DATA) as number;

  form = new FormGroup({
    cashReceived: new FormControl<number | undefined>(
      undefined,
      cashReceivedValidator(this.charge)
    ),
  });

  cashReceived = toSignal(this.form.controls.cashReceived.valueChanges);

  change = computed(() => {
    const cashReceived = this.cashReceived();

    if (this.form.invalid) {
      return undefined;
    }

    return cashReceived! - this.charge;
  });

  apply(): void {
    if (this.form.invalid) {
      return;
    }

    this.#dialogRef.close();
  }

  close(): void {
    this.#dialogRef.close();
  }
}
