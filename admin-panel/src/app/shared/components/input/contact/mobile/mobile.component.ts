import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputSelectComponent } from '../../select/select.component';
import { Mobile } from './mobile.interface';
import { COUNTRY_CODES } from '../country-codes.constant';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-input-mobile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    InputSelectComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './mobile.component.html',
  styleUrl: '../../input.component.scss',
})
export class InputMobileComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() validators: ValidatorFn[] = [];
  @Input() value: Mobile = { countryCode: '+63', number: '' };

  mobile!: FormGroup<{
    countryCode: FormControl<string | null>;
    number: FormControl<string | null>;
  }>;
  formBuilder = inject(FormBuilder);
  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.numberControl?.hasValidator(Validators.required);
  }

  get numberControl() {
    return this.mobile.get('number');
  }

  get countryCodes() {
    return COUNTRY_CODES;
  }

  ngOnInit() {
    this.mobile = this.formBuilder.group({
      countryCode: [this.value.countryCode, Validators.required],
      number: [
        this.value.number,
        [
          ...this.validators,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^\d*$/),
        ],
      ],
    });
    this.parentFormGroup.addControl(this.controlName, this.mobile);
  }

  ngOnDestroy() {
    this.parentFormGroup?.removeControl(this.controlName);
  }
}
