import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';

@Component({
  selector: 'app-input-email',
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
  templateUrl: './email.component.html',
  styleUrl: '../input.component.scss',
})
export class InputEmailComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() validators: ValidatorFn[] = [];
  @Input() value: Maybe<string>;
  @Input() showLabel: boolean = true;

  email!: FormControl;
  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.email.hasValidator(Validators.required);
  }

  ngOnInit() {
    this.email = new FormControl(this.value, [
      ...this.validators,
      Validators.email,
    ]);
    this.parentFormGroup.addControl(this.controlName, this.email);
  }

  ngOnDestroy() {
    this.parentFormGroup?.removeControl(this.controlName);
  }
}
