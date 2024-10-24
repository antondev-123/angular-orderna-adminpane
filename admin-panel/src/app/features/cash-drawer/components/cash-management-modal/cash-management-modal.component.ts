import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import {
  MatButtonToggleModule,
  MatButtonToggleChange,
} from '@angular/material/button-toggle';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../shared/components/button/button.component';
import { InputNumberComponent } from '../../../../shared/components/input/number/number.component';
import { InputTextComponent } from '../../../../shared/components/input/text/text.component';
import { InputTextAreaComponent } from '../../../../shared/components/input/textarea/textarea.component';
import { CashManagement } from '../../../../model/cash-drawer';

@Component({
  selector: 'app-modal-cash-management',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    InputTextComponent,
    MatButtonToggleModule,
    InputTextAreaComponent,
    InputNumberComponent,
    ButtonComponent,
    ButtonTextDirective,
    ReactiveFormsModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './cash-management-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class CashManagementModalComponent implements OnInit {
  Validators = Validators;

  errorMessage: string = '';
  formCashManagement!: FormGroup;

  get cashData() {
    return this.data;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CashManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: Maybe<CashManagement>
  ) {}

  ngOnInit(): void {
    this.formCashManagement = this.formBuilder.group({
      cashType: ['cashIn'],
      id: undefined,
      time: null,
    });
    if (this.data) {
      this.formCashManagement.patchValue({
        cashType: this.data.cashType,
        id: this.data.id,
        time: this.data.time,
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onChange($event: MatButtonToggleChange) {
    this.formCashManagement.patchValue({ cashType: $event.value });
  }

  handleSubmit() {
    this.dialogRef.close(this.formCashManagement.value);
  }
}
