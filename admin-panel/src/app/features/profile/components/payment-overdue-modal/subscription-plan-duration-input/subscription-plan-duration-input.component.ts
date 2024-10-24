import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SubscriptionPlanDuration } from './subscription-plan-duration';

@Component({
  selector: 'app-input-subscription-plan-duration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './subscription-plan-duration-input.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/input/input.component.scss',
    './subscription-plan-duration-input.component.scss',
  ],
})
export class InputSubscriptionPlanDurationComponent
  implements OnInit, OnDestroy
{
  subscriptionPlanDurationOptions = [
    { label: '3 months', value: SubscriptionPlanDuration.MONTHS_3 },
    { label: '6 months', value: SubscriptionPlanDuration.MONTHS_6 },
    { label: '12 + 1 months', value: SubscriptionPlanDuration.MONTHS_13 },
  ];

  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() hintText?: string;
  @Input() validators: ValidatorFn[] = [];
  @Input() value: SubscriptionPlanDuration = SubscriptionPlanDuration.MONTHS_3;

  duration!: FormControl;
  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.duration.hasValidator(Validators.required);
  }

  get hasHint() {
    return !!this.hintText;
  }

  ngOnInit() {
    this.duration = new FormControl(this.value, this.validators);
    this.parentFormGroup.addControl(this.controlName, this.duration);
  }

  ngOnDestroy() {
    this.parentFormGroup?.removeControl(this.controlName);
  }

  handleDurationSelected(duration: SubscriptionPlanDuration) {
    this.duration.patchValue(duration);
  }

  isDurationSelected(duration: SubscriptionPlanDuration) {
    return this.duration.value === duration;
  }
}
