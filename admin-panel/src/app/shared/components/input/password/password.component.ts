import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { SubscriptionManager } from '@orderna/admin-panel/src/utils/subscription-manager';
import { STRONG_PASSWORD_REGEX } from './password.constants';

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './password.component.html',
  styleUrls: ['../input.component.scss', './password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordComponent
  extends SubscriptionManager
  implements OnInit, OnDestroy
{
  id = input.required<string>();
  label = input.required<string>();
  controlName = input.required<string>();
  placeholder = input<string>('');
  showLabel = input<boolean>(true);
  validators = input<ValidatorFn[]>([]);
  disabled = input<boolean>(false);
  requireStrongPassword = input<boolean>(false);
  isUppercaseInput = input<boolean>(false);
  value = input<Maybe<string>>();
  prefixText = input<string>();
  suffixText = input<string>();
  hintText = input<string>();

  hasPrefix = computed(() => !!this.prefixText());
  hasSuffix = computed(() => !!this.suffixText());
  hasHint = computed(() => !!this.hintText());
  private _validators = computed(() => {
    const validators = [...this.validators()];
    if (this.requireStrongPassword()) {
      validators.push(Validators.pattern(STRONG_PASSWORD_REGEX));
    }
    return validators;
  });

  isVisible = signal<boolean>(false);

  password!: FormControl;
  parentContainer = inject(ControlContainer);

  get passwordRequirements() {
    const password = this.password?.value;
    if (!password) return [];
    return [
      {
        passed: password.match('^(?=.*[A-Z])'),
        description: 'One uppercase letter',
      },
      {
        passed: password.match('^(?=.*[a-z])'),
        description: 'One lowercase letter',
      },
      {
        passed: password.match('(.*[0-9].*)'),
        description: 'One number',
      },
      {
        passed: password.match('(?=.*[!@#$%^&*])'),
        description: 'One special character',
      },
      {
        passed: password.value?.match('.{8,}'),
        description: '8 character minimum',
      },
    ];
  }

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.password.hasValidator(Validators.required);
  }

  ngOnInit() {
    this.password = new FormControl(
      { value: this.value(), disabled: this.disabled() },
      this._validators()
    );
    this.parentFormGroup.addControl(this.controlName(), this.password);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.parentFormGroup?.removeControl(this.controlName());
  }

  toggleVisibility(): void {
    this.isVisible.update((o) => !o);
  }
}
