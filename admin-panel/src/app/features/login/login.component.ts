import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserCredentials } from '../../model/user';
import { take } from 'rxjs';
import { LoaderService } from '../../services/shared/loader/loader.service';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../shared/components/button/button.component';
import { RegisterComponent } from '../register/register.component';
import {
  AUTH_DECORATION_IMG_DETAILS,
  AUTH_IMG_DETAILS,
} from '@orderna/admin-panel/src/utils/constants/image-details';
import { InputPasswordComponent } from '../../shared/components/input/password/password.component';
import { AuthApiService } from '../../core/auth/auth-api.service';
import { InputEmailComponent } from '../../shared/components/input/email/email.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    RouterModule,
    InputPasswordComponent,
    ReactiveFormsModule,
    ButtonComponent,
    ButtonTextDirective,
    InputEmailComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  RegisterComponent = RegisterComponent;
  static readonly AUTH_DECORATION_IMG_PATH: string =
    AUTH_DECORATION_IMG_DETAILS.path;
  static readonly AUTH_DECORATION_IMG_ALT: string =
    AUTH_DECORATION_IMG_DETAILS.alt;
  static readonly AUTH_IMG_PATH: string = AUTH_IMG_DETAILS.path;
  static readonly AUTH_IMG_ALT: string = AUTH_IMG_DETAILS.alt;

  Validators = Validators;
  errorMessage?: string;

  loading: boolean = false;

  formGroup!: FormGroup;

  constructor(
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private authService: AuthApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({});
  }

  login() {
    this.loaderService.setLoading(true);
    this.loading = true;

    if (this.formGroup.invalid) {
      this.loaderService.setLoading(false);
      this.loading = false;
      return;
    }

    const userData = this.formGroup.value;
    const userCredentials: UserCredentials = {
      email: userData['email'],
      password: userData['password'],
    };

    this.authService
      .login(userCredentials)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.loaderService.setLoading(false);
          this.loading = false;
        },
        error: () => {
          this.loaderService.setLoading(false);
          this.loading = false;
          this.errorMessage = 'Wrong password.';
        },
      });
  }
}
