import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  computed,
  inject,
  signal,
  viewChild,
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
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import flatpickr from 'flatpickr';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FlatPickrOutputOptions } from 'angularx-flatpickr/lib/flatpickr.directive';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-input-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FlatpickrModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './datepicker.component.html',
  styleUrls: ['../input.component.scss', './datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ord-datepicker',
  },
})
export class InputDatePickerComponent implements OnInit {
  @Input() id!: string;
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() value: Maybe<Date> | Maybe<{ to?: Date; from?: Date }>;
  @Input() validators: ValidatorFn[] = [];
  @Input() enableTime: boolean = false;

  // Sets the minimum date. If not provided, any date in the past is allowed up to today.
  @Input() minDate?: Date;

  // Sets the maximum date. Default is today.
  @Input() maxDate?: Date = new Date();

  @Input() toggleable: boolean = false;
  @Input() toggleLabel: string = 'Specify date';
  @Input() toggleChecked = false;
  @Input() mode?: 'single' | 'multiple' | 'range' = 'single';

  @Output() dateChange = new EventEmitter<FlatPickrOutputOptions>();

  parentContainer = inject(ControlContainer);
  cdr = inject(ChangeDetectorRef);
  scrollDispatcher = inject(ScrollDispatcher);

  isCalendarVisible = signal<boolean>(false);

  flatpickrInputElement = viewChild<ElementRef>('flatpickrInput');
  calendarIconElement = viewChild<ElementRef>('calendarIcon');

  flatpickrInputElement$ = toObservable(this.flatpickrInputElement);
  scrollEvent$ = this.flatpickrInputElement$.pipe(
    filter((element) => element instanceof ElementRef),
    switchMap((element) => this.scrollDispatcher.ancestorScrolled(element!)),
    filter((cdkScrollable) => cdkScrollable instanceof CdkScrollable),
    tap((_) => this.closeCalendar())
  );
  scrollEvent = toSignal(this.scrollEvent$);

  flatpickrInstance = computed<flatpickr.Instance | null>(
    () => this.flatpickrInputElement()?.nativeElement._flatpickr ?? null
  );

  date!: FormControl;

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  // Reference: https://flatpickr.js.org/formatting/
  get dateFormat() {
    return this.enableTime ? 'm/d/Y H:i' : 'm/d/Y';
  }

  get required() {
    return this.date.hasValidator(Validators.required);
  }

  get placeholder() {
    return this.enableTime
      ? 'mm/dd/yyyy HH:mm'
      : this.mode == 'range'
      ? 'mm/dd/yyyy to mm/dd/yyyy'
      : 'mm/dd/yyyy';
  }

  get defaultValue() {
    if (this.value instanceof Date) {
      return this.value ? new Date(this.value) : null;
    }
    return this.value;
  }

  constructor() {}

  ngOnInit() {
    this.date = new FormControl(
      this.toggleable && !this.value ? null : this.defaultValue,
      this.validators
    );
    this.parentFormGroup.addControl(this.controlName, this.date);
  }

  ngOnDestroy() {
    this.parentFormGroup?.removeControl(this.controlName);
  }

  handleToggle(event: MatSlideToggleChange) {
    this.toggleChecked = event.checked;
    this.resetDate();
  }

  handleToggleCalendar() {
    if (this.isCalendarVisible()) {
      this.closeCalendar();
    } else {
      this.openCalendar();
    }
  }

  // TODO: Consider moving to a store
  openCalendar() {
    const flatpickr = this.flatpickrInstance();
    if (!flatpickr) {
      throw new Error('No flatpickr instance found');
    }
    flatpickr.open();
  }

  closeCalendar() {
    const flatpickr = this.flatpickrInstance();
    if (!flatpickr) {
      throw new Error('No flatpickr instance found');
    }
    flatpickr.close();
  }

  resetDate() {
    setTimeout(() => {
      this.date.reset(this.toggleChecked ? this.defaultValue : null);
      this.cdr.detectChanges();
    }, 0);
  }
}
