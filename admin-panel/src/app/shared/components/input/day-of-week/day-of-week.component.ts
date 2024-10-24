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
import { DayOfWeek } from '@orderna/admin-panel/src/types/day-of-week';

function atLeastOneDaySelectedValidator(): ValidatorFn {
  return (formArray: AbstractControl): { [key: string]: any } | null => {
    const atLeastOneSelected = (formArray as any).controls.some(
      (control: AbstractControl) => control.value === true
    );
    return atLeastOneSelected ? null : { atLeastOneDaySelected: true };
  };
}

@Component({
  selector: 'app-input-day-of-week',
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
  templateUrl: './day-of-week.component.html',
  styleUrls: ['../input.component.scss', './day-of-week.component.scss'],
})
export class InputDayOfWeekComponent implements OnInit, OnDestroy {
  daysOfWeekValues = Object.values(DayOfWeek).filter(
    (d) => d !== DayOfWeek.PUBLIC_HOLIDAYS
  );
  daysOfWeekOptions = this.daysOfWeekValues.map((d) => ({
    label: `${d[0].toUpperCase()}${d.slice(1, 3)}`,
    value: d,
  }));

  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() hintText?: string;

  // All days are selected by default
  @Input() value: DayOfWeek[] = this.daysOfWeekValues;

  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.daysOfWeek.hasValidator(Validators.required);
  }

  get hasHint() {
    return !!this.hintText;
  }

  get daysOfWeek() {
    return this.parentFormGroup.controls[this.controlName] as FormArray;
  }

  ngOnInit() {
    this.parentFormGroup.addControl(
      this.controlName,
      new FormArray(
        this.daysOfWeekValues.map(
          (dayOfWeek) => new FormControl(this.value.includes(dayOfWeek))
        ),
        atLeastOneDaySelectedValidator()
      )
    );
  }

  ngOnDestroy() {
    this.parentFormGroup?.removeControl(this.controlName);
  }

  handleDaySelected(index: number) {
    const dayOfWeekControl = this.daysOfWeek.at(index);
    if (dayOfWeekControl) {
      dayOfWeekControl.setValue(!dayOfWeekControl.value);
    } else {
      console.error(`No dayOfWeek control found at index ${index}`);
    }
  }

  isDaySelected(index: number) {
    const dayOfWeekControl = this.daysOfWeek.at(index);
    if (dayOfWeekControl) {
      return dayOfWeekControl.value;
    } else {
      console.error(`No dayOfWeek control found at index ${index}`);
      return false;
    }
  }
}
