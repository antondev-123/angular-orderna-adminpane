import { Component, OnInit, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../shared/components/button/button.component';
import { InputTextAreaComponent } from '../../shared/components/input/textarea/textarea.component';
import { InputNumberComponent } from '../../shared/components/input/number/number.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { User } from '../../model/user';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { CashDrawer } from '../../model/cash-drawer';
import { CashDrawersApiService } from '../../services/cash-drawers/cash-drawers-api.service';
import { AuthApiService } from '../../core/auth/auth-api.service';
import { CashManagementModalComponent } from './components/cash-management-modal/cash-management-modal.component';

@Component({
  selector: 'app-cash-drawer',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    MatIconModule,
    ButtonComponent,
    ButtonTextDirective,
    InputTextAreaComponent,
    InputNumberComponent,
    MatDialogModule,
    FlatpickrModule,
  ],
  templateUrl: './cash-drawer.component.html',
  styleUrl: './cash-drawer.component.css',
})
export class CashDrawerComponent implements OnInit {
  Validators = Validators;
  formRegister!: FormGroup;
  closingSummary!: FormGroup;
  isRegisterSection!: boolean;
  dateFilter = {
    from: new Date(),
    to: new Date(),
  };
  countedCash!: number;
  public cashDrawerObs$!: Observable<CashDrawer>;
  lastCashDrawer!: CashDrawer;

  cashManagement!: FormGroup;
  showCashMovements!: boolean;
  currentUser!: Maybe<User>;
  cashPaymentsReceived!: number;
  private cashDrawersService = inject(CashDrawersApiService);

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private authService: AuthApiService
  ) { }

  ngOnInit(): void {
    this.isRegisterSection = false;
    this.showCashMovements = true;
    this.cashManagement = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
    this.formRegister = this.formBuilder.group({});
    this.closingSummary = this.formBuilder.group({});
    this.authService.currentUser.subscribe((data) => {
      this.currentUser = data;
    });
    this.countedCash = 0;
    this.cashDrawerObs$ = this.cashDrawersService.getLastCashDrawer();
    this.cashDrawerObs$.subscribe((data) => {
      this.lastCashDrawer = data;
    });

    // TODO: Get value from API
    this.cashPaymentsReceived = 0;
  }

  handleSubmit() {
    const registerValue = this.formRegister.value;
    const { cash, note } = registerValue;
    const item = this.formBuilder.group({
      user: this.currentUser?.fullName,
      amount: cash ?? 0,
      note: note ?? '',
      cashType: 'cashIn',
      id: 1,
      time: new Date(),
    });
    this.items.push(item);
    this.isRegisterSection = true;
  }

  get items() {
    return this.cashManagement.get('items') as FormArray;
  }

  timeFormat(date: Date) {
    return this.datePipe.transform(date, 'HH:mm a');
  }

  dateTimeFormat(date?: Date) {
    if (!date) {
      return this.datePipe.transform(new Date(), 'EEE, dd MMMM yyyy, HH:mm a');
    }
    return this.datePipe.transform(date, 'EEE, dd MMMM yyyy, HH:mm a');
  }

  get expectedCash() {
    let val = 0;
    for (let i = 0; i < this.items.value.length; i++) {
      if (this.items.value[i].cashType === 'cashIn') {
        val += this.items.value[i].amount;
      } else if (this.items.value[i].cashType === 'cashOut') {
        val -= this.items.value[i].amount;
      }
    }
    return val;
  }

  get lastExpectedCash() {
    return this.lastCashDrawer.expectedCash;
  }

  get expectedVsCountedCashDifference() {
    return this.countedCash - this.expectedCash;
  }

  removeCashManagement(index: number) {
    this.items.value.splice(index, 1);
  }

  openCustomerModal(index?: number) {
    const dialogRef = this.dialog.open(CashManagementModalComponent, {
      id: 'add-customer-modal',
      data: index !== undefined ? this.cashManagement.value.items[index] : null,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          const item = this.formBuilder.group({
            user: this.currentUser?.fullName,
            amount: result.amount,
            note: result.note,
            time: result.time || new Date(),
            cashType: result.cashType,
            id: result.id ?? this.cashManagement.value.items.length + 1,
          });
          if (result.id && this.cashManagement.value.items[result.id - 1]) {
            this.items.at(result.id - 1).setValue(item.value);
          } else {
            this.items.push(item);
          }
        }
      });
  }
}
