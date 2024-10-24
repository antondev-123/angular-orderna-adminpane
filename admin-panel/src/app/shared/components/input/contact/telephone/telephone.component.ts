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
import { Telephone } from './telephone.interface';
import { COUNTRY_CODES } from '../country-codes.constant';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-input-telephone',
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
  templateUrl: './telephone.component.html',
  styleUrl: '../../input.component.scss',
})
export class InputTelephoneComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() validators: ValidatorFn[] = [];
  @Input() value: Telephone = { countryCode: '+63', number: '' };

  telephone!: FormGroup<{
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
    return this.telephone.get('number');
  }

  get countryCodes() {
    return COUNTRY_CODES;
  }

  ngOnInit() {
    this.telephone = this.formBuilder.group({
      countryCode: [this.value.countryCode, Validators.required],
      number: [
        this.value.number,
        [
          ...this.validators,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern(/^\d*$/),
        ],
      ],
    });
    this.parentFormGroup.addControl(this.controlName, this.telephone);
  }

  ngOnDestroy() {
    this.parentFormGroup?.removeControl(this.controlName);
  }
}
