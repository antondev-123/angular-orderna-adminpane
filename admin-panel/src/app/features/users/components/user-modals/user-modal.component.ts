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
  FilterOption,
  FilterOptionItem,
} from '@orderna/admin-panel/src/types/filter';
import { Role } from '../../../../model/enum/role';
import {
  IUser,
  User,
  UserCreateData,
  UserUpdateData,
} from '../../../../model/user';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { Status } from '../../../../model/enum/status';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { take } from 'rxjs';
import { InputMobileComponent } from '../../../../shared/components/input/contact/mobile/mobile.component';
import { UsersApiService } from '../../../../services/users/users-api.service';

@Component({
  selector: 'app-modal-user',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    InputTextComponent,
    InputEmailComponent,
    InputMobileComponent,
    InputSelectComponent,
    ButtonComponent,
    ButtonTextDirective,
    ReactiveFormsModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './user-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class UserModalComponent implements OnInit {
  Validators = Validators;

  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';
  formGroup!: FormGroup;

  roleOptions: FilterOption<IUser, 'role'>[] = [
    {
      label: 'Cashier',
      value: Role.CASHIER,
    },
    {
      label: 'Manager',
      value: Role.MANAGER,
    },
    {
      label: 'Admin',
      value: Role.ADMIN,
    },
  ];

  statusOptions: FilterOption<IUser, 'status'>[] = [
    {
      label: 'Active',
      value: Status.ACTIVE,
    },
    {
      label: 'Inactive',
      value: Status.INACTIVE,
    },
    {
      label: 'Pending',
      value: Status.PENDING,
    },
  ];

  defaultRoleOption = this.roleOptions[0] as FilterOptionItem<Role>;
  defaultStatusOption = this.statusOptions[0] as FilterOptionItem<Status>;

  get user() {
    return this.data.user;
  }

  get mode() {
    return this.user ? 'edit' : 'create';
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UserModalComponent>,
    private loaderService: LoaderService,
    private usersService: UsersApiService,
    @Inject(MAT_DIALOG_DATA) public data: { user: Maybe<User> }
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
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `${this.mode} user cancelled.`);
  }

  private createUser() {
    const userData = this.formGroup.value;
    const user: UserCreateData = {
      firstName: userData['firstName'],
      lastName: userData['lastName'],
      email: userData['email'],
      mobile: userData['mobile'],
      role: userData['role'],
      jobTitle: userData['jobTitle'],
    };

    this.disableForm();

    this.usersService
      .createUser(user)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private updateUser() {
    if (!this.user) {
      console.error('No user to update.');
      return;
    }

    const userData = this.formGroup.value;
    const user: UserUpdateData = {
      id: this.user.id,
      firstName: userData['firstName'],
      lastName: userData['lastName'],
      email: userData['email'],
      mobile: userData['mobile'],
      role: userData['role'],
      jobTitle: userData['jobTitle'],
      status: userData['status'],
    };

    this.usersService
      .updateUser(user)
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
      this.mode === 'create' ? 'user created!' : 'user updated!'
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

    // Allow user to close dialog
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
