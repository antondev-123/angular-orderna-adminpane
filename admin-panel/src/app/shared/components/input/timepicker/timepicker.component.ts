import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
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
import { MatInputModule } from '@angular/material/input';
import { FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'app-input-timepicker',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    FlatpickrModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './timepicker.component.html',
  styleUrl: '../input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTimePickerComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() validators: ValidatorFn[] = [];
  @Input() value?: string;
  @Input() hintText?: string;
  @Input() placeholder: string = 'HH:mm';

  // HH:mm
  @Input() minTime?: string = '00:00';
  @Input() maxTime?: string;

  time!: FormControl;
  parentContainer = inject(ControlContainer);

  // Reference: https://flatpickr.js.org/formatting/
  timeFormat = 'H:i';

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.time.hasValidator(Validators.required);
  }

  get hasHint() {
    return !!this.hintText;
  }

  ngOnInit() {
    this.time = new FormControl(this.value, this.validators);
    this.parentFormGroup.addControl(this.controlName, this.time);
  }

  ngOnDestroy() {
    this.parentFormGroup?.removeControl(this.controlName);
  }
}
