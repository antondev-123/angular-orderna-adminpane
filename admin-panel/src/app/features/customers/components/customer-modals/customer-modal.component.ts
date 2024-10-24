import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { InputTextComponent } from '../../../../shared/components/input/text/text.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../shared/components/button/button.component';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { InputEmailComponent } from '../../../../shared/components/input/email/email.component';
import { InputSelectComponent } from '../../../../shared/components/input/select/select.component';
import {
  Customer,
  CustomerCreateData,
  CustomerUpdateData,
} from '../../../../model/customer';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { take } from 'rxjs';
import { InputDatePickerComponent } from '../../../../shared/components/input/datepicker/datepicker.component';
import { InputTextAreaComponent } from '../../../../shared/components/input/textarea/textarea.component';
import { InputMobileComponent } from '../../../../shared/components/input/contact/mobile/mobile.component';
import { InputTelephoneComponent } from '../../../../shared/components/input/contact/telephone/telephone.component';
import { CustomersApiService } from '../../../../services/customers/customers-api.service';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-modal-customer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    InputTextComponent,
    InputEmailComponent,
    InputMobileComponent,
    InputTelephoneComponent,
    InputSelectComponent,
    InputDatePickerComponent,
    InputTextAreaComponent,
    ButtonComponent,
    ButtonTextDirective,
    ReactiveFormsModule,
    CdkScrollable,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './customer-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class CustomerModalComponent implements OnInit {
  Validators = Validators;

  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';
  formGroup!: FormGroup;

  get customer() {
    return this.data.customer;
  }

  get mode() {
    return this.customer ? 'edit' : 'create';
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CustomerModalComponent>,
    private loaderService: LoaderService,
    private customersService: CustomersApiService,
    @Inject(MAT_DIALOG_DATA) public data: { customer: Maybe<Customer> }
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({});
  }

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    if (this.formGroup.invalid) {
      this.loaderService.setLoading(false);
      this.loading = false;
      return;
    }

    // Prevent customer from closing dialog
    this.dialogRef.disableClose = true;

    // Prevent customer from editing form fields
    this.disableForm();

    if (this.mode === 'create') {
      this.createCustomer();
    } else {
      this.updateCustomer();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `${this.mode} customer cancelled.`);
  }

  private createCustomer() {
    const customerData = this.formGroup.value;

    const {
      firstName,
      lastName,
      company,
      zipCode,
      city,
      street,
      telephone,
      mobileNumber,
      email,
      birthday,
      note,
    } = customerData;

    const customer: CustomerCreateData = {
      firstName,
      lastName,
      mobileNumber: `${mobileNumber.countryCode}${mobileNumber.number}`,
      ...(company && { company }),
      ...(zipCode && { zipCode }),
      ...(city && { city }),
      ...(street && { street }),
      ...(telephone && {
        telephone: `${telephone.countryCode}${telephone.number}`,
      }),
      ...(email && { email }),
      ...(birthday && { birthday }),
      ...(note && { note }),
    };

    this.disableForm();

    this.customersService
      .createCustomer(customer)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private updateCustomer() {
    if (!this.customer) {
      console.error('No customer to update.');
      return;
    }

    const customerData = this.formGroup.value;

    const {
      firstName,
      lastName,
      company,
      zipCode,
      city,
      street,
      telephone,
      mobileNumber,
      email,
      birthday,
      note,
    } = customerData;

    const customer: CustomerUpdateData = {
      id: this.customer.id,
      firstName,
      lastName,
      mobileNumber: `${mobileNumber.countryCode}${mobileNumber.number}`,
      ...(company && { company }),
      ...(zipCode && { zipCode }),
      ...(city && { city }),
      ...(street && { street }),
      ...(telephone && {
        telephone: `${telephone.countryCode}${telephone.number}`,
      }),
      ...(email && { email }),
      ...(birthday && { birthday }),
      ...(note && { note }),
    };

    this.customersService
      .updateCustomer(customer)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess(): void {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(
      this.mode === 'create' ? 'customer created!' : 'customer updated!'
    );
    this.reset();
  }

  private handleError(err: any): void {
    this.success = false;
    this.errorMessage = (err as Error).message;
    this.reset();
  }

  private reset(): void {
    // Reset loading states
    this.loading = false;
    this.loaderService.setLoading(false);

    // Reset form
    this.formGroup.reset();
    this.enableForm();

    // Allow customer to close dialog
    this.dialogRef.disableClose = false;
  }

  private disableForm() {
    for (const control of Object.values(this.formGroup.controls)) {
      control.disable();
    }
  }

  private enableForm() {
    for (const control of Object.values(this.formGroup.controls)) {
      control.enable();
    }
  }
}
