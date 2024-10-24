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
  selector: 'app-input-number',
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
  templateUrl: './number.component.html',
  styleUrl: '../input.component.scss',
})
export class InputNumberComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() validators: ValidatorFn[] = [];
  @Input() value: Maybe<number>;
  @Input() prefixText?: string;
  @Input() suffixText?: string;
  @Input() hintText?: string;

  @Output() valueChanges = new EventEmitter<number>();

  text!: FormControl;
  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.text.hasValidator(Validators.required);
  }

  get hasHint() {
    return !!this.hintText;
  }

  get hasPrefix() {
    return !!this.prefixText;
  }

  get hasSuffix() {
    return !!this.suffixText;
  }

  ngOnInit() {
    this.text = new FormControl(this.value, this.validators);
    this.text.valueChanges.subscribe((value) => {
      this.valueChanges.emit(value);
    });
    this.parentFormGroup.addControl(this.controlName, this.text);
  }

  ngOnDestroy() {
    this.parentFormGroup?.removeControl(this.controlName);
  }
}
