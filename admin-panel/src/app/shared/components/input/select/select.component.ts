import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FilterOption,
  FilterOptionItem,
} from '@orderna/admin-panel/src/types/filter';
import { isGroup } from '@orderna/admin-panel/src/utils/filter';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  host: { 'hostID': crypto.randomUUID().toString() }
})
export class InputSelectComponent<T, K extends keyof T>
  implements OnInit, OnDestroy
{
  @Input() id!: string;
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() options!: FilterOption<T, K>[];
  @Input() defaultOption!: FilterOptionItem<T[K]>;
  @Input() validators: ValidatorFn[] = [];
  @Input() value?: string | T[K];
  @Input() placeholder: string = 'Select item(s)';
  @Input() allowMultipleSelection: boolean = false;
  @Input() resettable: boolean = false;

  @Output() valueChanges = new EventEmitter<string | T[K]>();

  select!: FormControl;
  parentContainer = inject(ControlContainer);
  isGroup = isGroup;

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.select.hasValidator(Validators.required);
  }

  ngOnInit() {
    this.select = new FormControl(this.value ?? this.defaultOption?.value, [
      ...this.validators,
    ]);
    this.select.valueChanges.subscribe((value) => {
      this.valueChanges.emit(value);
    });
    this.parentFormGroup.addControl(this.controlName, this.select);
  }
  
  ngOnChanges(changes:SimpleChanges)
  {
      if (changes['value'] && !changes['value'].isFirstChange()) {
          this.select.setValue(this.value);
      }
      if (changes['defaultOption '] && !changes['defaultOption '].isFirstChange()) {
          this.select.setValue(this.defaultOption?.value);
      }
  }

  ngOnDestroy() {
    this.parentFormGroup?.removeControl(this.controlName);
  }
}
