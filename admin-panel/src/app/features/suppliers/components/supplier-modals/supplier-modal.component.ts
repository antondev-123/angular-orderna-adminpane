import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InputTextComponent } from '../../../../shared/components/input/text/text.component';
import { InputEmailComponent } from '../../../../shared/components/input/email/email.component';
import { InputSelectComponent } from '../../../../shared/components/input/select/select.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../shared/components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import {
  Supplier,
  SupplierCreateData,
  SupplierUpdateData,
} from '../../../../model/supplier';
import { take } from 'rxjs';
import { InputTextAreaComponent } from '../../../../shared/components/input/textarea/textarea.component';
import { InputMobileComponent } from '../../../../shared/components/input/contact/mobile/mobile.component';
import { InputTelephoneComponent } from '../../../../shared/components/input/contact/telephone/telephone.component';
import { SuppliersApiService } from '../../../../services/suppliers/suppliers-api.service';

@Component({
  selector: 'app-supplier-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    InputTextComponent,
    InputEmailComponent,
    InputMobileComponent,
    InputSelectComponent,
    InputTelephoneComponent,
    ButtonComponent,
    ButtonTextDirective,
    ReactiveFormsModule,
    InputTextAreaComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './supplier-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class SupplierModalComponent implements OnInit {
  Validators = Validators;

  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';
  formGroup!: FormGroup;

  get supplier() {
    return this.data.supplier;
  }

  get mode() {
    return this.supplier ? 'edit' : 'create';
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SupplierModalComponent>,
    private loaderService: LoaderService,
    private suppliersService: SuppliersApiService,
    @Inject(MAT_DIALOG_DATA) public data: { supplier: Maybe<Supplier> }
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

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    // Prevent user from editing form fields
    this.disableForm();

    if (this.mode === 'create') {
      this.createSupplier();
    } else {
      this.updateSupplier();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `${this.mode} supplier cancelled.`);
  }

  private createSupplier() {
    const supplierData = this.formGroup.value;
    const supplier: SupplierCreateData = {
      firstName: supplierData['firstName'],
      lastName: supplierData['lastName'],
      email: supplierData['email'],
      zipCode: supplierData['zipCode'],
      city: supplierData['city'],
      street: supplierData['street'],
      note: supplierData['note'],
      mobileNumber: `${supplierData['mobileNumber'].countryCode}${supplierData['mobileNumber'].number}`,
      telephoneNumber: `${supplierData['telephoneNumber'].countryCode}${supplierData['telephoneNumber'].number}`,
      company: supplierData['company'],
    };
    this.disableForm();

    this.suppliersService
      .createSupplier(supplier)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private updateSupplier() {
    if (!this.supplier) {
      console.error('No supplier to update.');
      return;
    }

    const supplierData = this.formGroup.value;
    const supplier: SupplierUpdateData = {
      id: this.supplier.id,
      firstName: supplierData['firstName'],
      lastName: supplierData['lastName'],
      email: supplierData['email'],
      zipCode: supplierData['zipCode'],
      city: supplierData['city'],
      street: supplierData['street'],
      mobileNumber: `${supplierData['mobileNumber'].countryCode}${supplierData['mobileNumber'].number}`,
      telephoneNumber: `${supplierData['telephoneNumber'].countryCode}${supplierData['telephoneNumber'].number}`,
      company: supplierData['company'],
      note: supplierData['note'],
    };

    this.suppliersService
      .updateSupplier(supplier)
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
      this.mode === 'create' ? 'supplier created!' : 'supplier updated!'
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

    // Allow supplier to close dialog
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
