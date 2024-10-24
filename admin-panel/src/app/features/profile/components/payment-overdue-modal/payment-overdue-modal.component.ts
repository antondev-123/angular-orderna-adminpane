import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { InputSelectComponent } from '@orderna/admin-panel/src/app/shared/components/input/select/select.component';
import { PAYMENT_FILTER_OPTIONS } from '@orderna/admin-panel/src/utils/constants/filter-options';
import { InputSubscriptionPlanDurationComponent } from './subscription-plan-duration-input/subscription-plan-duration-input.component';
import { SubscriptionPlanDuration } from './subscription-plan-duration-input/subscription-plan-duration';
import { PaymentType } from '@orderna/admin-panel/src/app/model/enum/payment-type';
import { CapitalizePipe } from '@orderna/admin-panel/src/app/common/pipes/capitalize/capitalize.pipe';

@Component({
  selector: 'app-payment-overdue-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    InputSelectComponent,
    InputSubscriptionPlanDurationComponent,
    ButtonComponent,
    ButtonTextDirective,
    ReactiveFormsModule,
    CurrencyPipe,
    CapitalizePipe,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './payment-overdue-modal.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
    './payment-overdue-modal.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentOverdueModalComponent {
  Validators = Validators;
  loading: boolean = false;
  errorMessage = '';

  formGroup: FormGroup = new FormGroup({});
  paymentOptions = PAYMENT_FILTER_OPTIONS;

  get subscriptionPlanDuration(): SubscriptionPlanDuration {
    return this.formGroup.value['subscriptionPlanDuration'];
  }

  get paymentMethod(): PaymentType {
    return this.formGroup.value['paymentMethod'] ?? PaymentType.DEBIT_CARD;
  }

  readonly amountDueByPlanDuration = {
    [SubscriptionPlanDuration.MONTHS_3]: 1200,
    [SubscriptionPlanDuration.MONTHS_6]: 2200,
    [SubscriptionPlanDuration.MONTHS_13]: 4500,
  };

  get amountDue() {
    return this.amountDueByPlanDuration[this.subscriptionPlanDuration] ?? 0;
  }

  constructor(
    private dialogRef: MatDialogRef<PaymentOverdueModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { email: string; daysOverdue: number }
  ) {}

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? 'Payment overdue modal closed.');
  }

  handleSubmit(): void {
    //TODO
  }
}
