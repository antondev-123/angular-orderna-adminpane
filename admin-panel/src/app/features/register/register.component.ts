import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AUTH_DECORATION_IMG_DETAILS,
  AUTH_IMG_DETAILS,
} from '@orderna/admin-panel/src/utils/constants/image-details';
import { UserRegistrationData } from '../../model/user';
import { take } from 'rxjs';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../shared/components/button/button.component';
import { InputTextComponent } from '../../shared/components/input/text/text.component';
import { LoaderService } from '../../services/shared/loader/loader.service';
import { InputEmailComponent } from '../../shared/components/input/email/email.component';
import { FilterOption } from '@orderna/admin-panel/src/types/filter';
import { Role } from '../../model/enum/role';
import { InputSelectComponent } from '../../shared/components/input/select/select.component';
import { InputPasswordComponent } from '../../shared/components/input/password/password.component';
import { AuthApiService } from '../../core/auth/auth-api.service';
import { InputMobileComponent } from '../../shared/components/input/contact/mobile/mobile.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    FormsModule,
    RouterModule,
    ButtonComponent,
    ButtonTextDirective,
    InputTextComponent,
    InputEmailComponent,
    InputSelectComponent,
    InputPasswordComponent,
    InputMobileComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  Validators = Validators;

  RegisterComponent = RegisterComponent;
  static readonly AUTH_DECORATION_IMG_PATH: string =
    AUTH_DECORATION_IMG_DETAILS.path;
  static readonly AUTH_DECORATION_IMG_ALT: string =
    AUTH_DECORATION_IMG_DETAILS.alt;
  static readonly AUTH_IMG_PATH: string = AUTH_IMG_DETAILS.path;
  static readonly AUTH_IMG_ALT: string = AUTH_IMG_DETAILS.alt;

  errorMessage?: string;
  loading: boolean = false;
  formGroup!: FormGroup;

  roleOptions: FilterOption<UserRegistrationData, 'jobTitle'>[] = [
    { label: 'Cashier', value: Role.CASHIER },
    { label: 'Manager', value: Role.MANAGER },
    { label: 'Admin', value: Role.ADMIN },
  ];

  constructor(
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private authService: AuthApiService,
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({});
  }

  register() {
    this.loaderService.setLoading(true);
    this.loading = true;

    if (this.formGroup.invalid) {
      this.loaderService.setLoading(false);
      this.loading = false;
      return;
    }

    const userData = this.formGroup.value;
    const userRegistration: UserRegistrationData = {
      firstName: userData['firstName'],
      lastName: userData['lastName'],
      email: userData['email'],
      jobTitle: userData['jobTitle'],
      mobile: userData['mobile'] ? userData['mobile'] : null,
      username: userData['username'],
      password: userData['password'],
    };

    this.authService
      .register(userRegistration)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.loaderService.setLoading(false);
          this.loading = false;
        },
        error: (err) => {
          this.loaderService.setLoading(false);
          this.loading = false;
          this.errorMessage = err.error.message;
        },
      });
  }
}
