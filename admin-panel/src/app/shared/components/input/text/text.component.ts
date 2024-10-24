import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
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
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { SubscriptionManager } from '@orderna/admin-panel/src/utils/subscription-manager';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    CdkTextareaAutosize,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './text.component.html',
  styleUrl: '../input.component.scss',
})
export class InputTextComponent
  extends SubscriptionManager
  implements OnInit, OnDestroy
{
  @Input() id!: string;
  @Input() label!: string;
  @Input() showLabel: boolean = true;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() validators: ValidatorFn[] = [];
  @Input() disabled: boolean = false;

  /**
   * Determines whether the input value should be automatically converted to uppercase.
   * If set to true, any text typed by the user will be displayed in uppercase.
   */
  @Input() isUppercaseInput: boolean = false;

  @Input() value?: Maybe<string> = '';
  @Input() prefixText?: string;
  @Input() suffixText?: string;
  @Input() hintText?: string;
  @Input() patternErrorMessage?: string;

  text!: FormControl;
  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.text.hasValidator(Validators.required);
  }

  get hasPrefix() {
    return !!this.prefixText;
  }

  get hasSuffix() {
    return !!this.suffixText;
  }

  get hasHint() {
    return !!this.hintText;
  }

  ngOnInit() {
    this.text = new FormControl(
      { value: this.value, disabled: this.disabled },
      this.validators
    );
    this.parentFormGroup.addControl(this.controlName, this.text);

    this.subscribeToValueChanges();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.parentFormGroup?.removeControl(this.controlName);
  }

  private subscribeToValueChanges(): void {
    if (!this.isUppercaseInput) return;
    this.text.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (!value) return;
        const upperCaseValue = value.toUpperCase();
        if (value !== upperCaseValue) {
          this.text.setValue(upperCaseValue);
        }
      });
  }
}
