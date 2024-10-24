import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/button/back-button/back-button.component';
import { CommonModule } from '@angular/common';
import { InputDatePickerComponent } from '../../../../shared/components/input/datepicker/datepicker.component';
import { InputSelectComponent } from '../../../../shared/components/input/select/select.component';
import { InputTextComponent } from '../../../../shared/components/input/text/text.component';
import { InputTextAreaComponent } from '../../../../shared/components/input/textarea/textarea.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FilterOption,
  FilterOptionItem,
} from '@orderna/admin-panel/src/types/filter';
import {
  DiscountDetail,
  IDiscountCreateData,
  IDiscountUpdateData,
} from '../../../../model/discount';
import { DiscountType } from '../../../../model/enum/discount-type';
import { InputNumberComponent } from '../../../../shared/components/input/number/number.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../shared/components/button/button.component';
import { StoresDataSource } from '../../../../services/data-sources/stores.dataSource';
import { map, take, takeUntil } from 'rxjs';
import { generateRandomDiscountCode } from '@orderna/admin-panel/src/utils/discount-code-generator';
import { SubscriptionManager } from '@orderna/admin-panel/src/utils/subscription-manager';
import { InputDayOfWeekComponent } from '../../../../shared/components/input/day-of-week/day-of-week.component';
import { InputTimePickerComponent } from '../../../../shared/components/input/timepicker/timepicker.component';
import { addDays } from '@orderna/admin-panel/src/utils/date-helpers';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { CurrencyCode } from '../../../../model/enum/currency-code';
import { DayOfWeek } from '@orderna/admin-panel/src/types/day-of-week';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { StoresApiService } from '../../../../core/stores/stores-api.service';
import { DiscountsApiService } from '../../../../services/discounts/discounts-api.service';

@Component({
  selector: 'app-discount-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggle,
    ButtonComponent,
    ButtonTextDirective,
    BackButtonComponent,
    InputTextComponent,
    InputNumberComponent,
    InputSelectComponent,
    InputTextAreaComponent,
    InputDayOfWeekComponent,
    InputTimePickerComponent,
    InputDatePickerComponent,
  ],
  templateUrl: './discount-form.component.html',
  styleUrl: './discount-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountFormComponent
  extends SubscriptionManager
  implements OnInit, AfterViewInit
{
  @Input() discount?: DiscountDetail;

  Validators = Validators;
  defaultDaysAvailable = Object.values(DayOfWeek).filter(
    (d) => d !== DayOfWeek.PUBLIC_HOLIDAYS
  );
  router: Router = inject(Router);
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  formGroup!: FormGroup;

  get mode() {
    return this.discount ? 'edit' : 'create';
  }

  typeOptions: FilterOption<IDiscountCreateData, 'type'>[] = [
    {
      label: 'Percentage',
      value: DiscountType.PERCENTAGE,
    },
    {
      label: 'Fixed',
      value: DiscountType.FIXED,
    },
  ];
  defaultTypeOption = this.typeOptions[0] as FilterOptionItem<DiscountType>;

  storesDataSource = new StoresDataSource(this.storesService);
  storeNames$ = this.storesDataSource.storeNames$.asObservable();
  storeOptions$ = this.storeNames$.pipe(
    map((storeNames) => {
      return storeNames.map((store) => ({
        value: store.id,
        label: store.name,
      }));
    })
  );

  // Validity period
  validFrom?: Date;
  validThrough?: Date;
  defaultValidThrough?: Date;
  defaultValidFrom?: Date;

  get type() {
    return this.formGroup.value?.type;
  }

  get isPercentageType() {
    return this.type === DiscountType.PERCENTAGE;
  }

  get isFixedType() {
    return this.type === DiscountType.FIXED;
  }

  get availableFrom() {
    const value = this.formGroup.value?.availableFrom;
    return typeof value === 'string'
      ? DiscountFormComponent.createDateFromTimeString(value)
      : null;
  }

  get availableThrough() {
    const value = this.formGroup.value?.availableThrough;
    return typeof value === 'string'
      ? DiscountFormComponent.createDateFromTimeString(value)
      : null;
  }

  get daysAvailable() {
    return this.formGroup.value?.daysAvailable;
  }

  get isAvailableAllDay() {
    return this.formGroup.value?.isAvailableAllDay;
  }

  get isAvailableEveryday() {
    return this.daysAvailable?.every((d: boolean) => d);
  }

  constructor(
    private formBuilder: FormBuilder,
    private discountsService: DiscountsApiService,
    private storesService: StoresApiService,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({});

    this.initIsAvailableAllDayToggleControl();
    this.initIsArchivedToggleControl();

    this.storesDataSource.loadStoreNames();
  }

  initIsAvailableAllDayToggleControl() {
    const isAvailableAllDay = this.discount?.isAvailableAllDay ?? true;
    this.formGroup.addControl(
      'isAvailableAllDay',
      new FormControl(isAvailableAllDay)
    );
  }

  initIsArchivedToggleControl() {
    if (this.mode === 'edit') {
      this.formGroup.addControl(
        'isArchived',
        new FormControl(this.discount?.isArchived ?? false)
      );
    }
  }

  ngAfterViewInit() {
    this.subscribeToValidFromChanges();
    this.subscribeToValidThroughChanges();
    this.toggleAvailableTimepickerControls(
      this.discount?.isAvailableAllDay ?? true
    );

    this.cdr.detectChanges();
  }

  goToDiscountsPage() {
    this.router.navigate(['discounts']);
  }

  onIsAvailableAllDayToggled(change: MatSlideToggleChange) {
    this.toggleAvailableTimepickerControls(change.checked);
  }

  toggleAvailableTimepickerControls(checked: boolean) {
    const availableFromControl = this.formGroup.get('availableFrom');
    const availableThroughControl = this.formGroup.get('availableThrough');

    if (!availableFromControl || !availableThroughControl) return;

    if (checked) {
      availableFromControl.clearValidators();
      availableThroughControl.clearValidators();
    } else {
      availableFromControl.setValidators([Validators.required]);
      availableThroughControl.setValidators([Validators.required]);
    }

    availableFromControl.updateValueAndValidity();
    availableThroughControl.updateValueAndValidity();
  }

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    if (this.formGroup.invalid) {
      this.loaderService.setLoading(false);
      this.loading = false;
      return;
    }

    // Prevent customer from editing form fields
    this.disableForm();

    if (this.mode == 'create') {
      this.createDiscount();
    } else {
      this.updateDiscount();
    }
  }

  updateDiscount() {
    const discountData = this.formGroup.value;

    const {
      description,
      type,
      value,
      applicableStores,
      validFrom,
      validThrough,
      daysAvailable,
      isAvailableAllDay,
      availableFrom,
      availableThrough,
      minimumSpend,
      redemptionLimit,
      redemptionLimitPerCustomer,
      isArchived,
    } = discountData;

    const discount: IDiscountUpdateData = {
      id: this.discount!.id,
      ...(description && { description }),
      type,
      value: type === DiscountType.PERCENTAGE ? value / 100 : value,
      ...(type === DiscountType.FIXED && { currencyCode: CurrencyCode.PHP }),
      applicableStores,
      ...(validFrom && { validFrom }),
      ...(validThrough && { validThrough }),
      ...(daysAvailable && {
        daysAvailable: DiscountFormComponent.getSelectedDays(daysAvailable),
      }),
      ...(availableFrom &&
        availableThrough && {
          hoursAvailable: {
            opens: DiscountFormComponent.getTime(availableFrom),
            closes: DiscountFormComponent.getTime(availableThrough),
          },
        }),
      isAvailableAllDay,
      ...(minimumSpend && { minimumSpend }),
      ...(redemptionLimit && { redemptionLimit }),
      ...(redemptionLimitPerCustomer && { redemptionLimitPerCustomer }),
      isArchived,
    };

    this.disableForm();

    this.discountsService
      .updateDiscount(discount)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  createDiscount() {
    const discountData = this.formGroup.value;

    const {
      code,
      description,
      type,
      value,
      applicableStores,
      validFrom,
      validThrough,
      daysAvailable,
      isAvailableAllDay,
      availableFrom,
      availableThrough,
      minimumSpend,
      redemptionLimit,
      redemptionLimitPerCustomer,
    } = discountData;

    const discount: IDiscountCreateData = {
      code,
      ...(description && { description }),
      type,
      value: type === DiscountType.PERCENTAGE ? value / 100 : value,
      ...(type === DiscountType.FIXED && { currencyCode: CurrencyCode.PHP }),
      applicableStores,
      ...(validFrom && { validFrom }),
      ...(validThrough && { validThrough }),
      ...(daysAvailable && {
        daysAvailable: DiscountFormComponent.getSelectedDays(daysAvailable),
      }),
      ...(availableFrom &&
        availableThrough && {
          hoursAvailable: {
            opens: DiscountFormComponent.getTime(availableFrom),
            closes: DiscountFormComponent.getTime(availableThrough),
          },
        }),
      isAvailableAllDay,
      ...(minimumSpend && { minimumSpend }),
      ...(redemptionLimit && { redemptionLimit }),
      ...(redemptionLimitPerCustomer && { redemptionLimitPerCustomer }),
    };

    this.disableForm();

    this.discountsService
      .createDiscount(discount)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  generateDiscountCode() {
    const code = generateRandomDiscountCode();
    const codeControl = this.formGroup.get('code');
    if (codeControl) {
      codeControl.setValue(code);
    } else {
      console.error(`Control with name 'code' not found in the form.`);
    }
  }

  private subscribeToValidFromChanges() {
    const validFromControl = this.formGroup.get('validFrom');
    if (validFromControl) {
      validFromControl.valueChanges
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((value: Date) => {
          this.validFrom = value;
          this.defaultValidThrough = this.validFrom
            ? addDays(this.validFrom, 30)
            : undefined;
        });
    } else {
      console.error(`Control with name 'validFrom' not found in the form.`);
    }
  }

  private subscribeToValidThroughChanges() {
    const validFromControl = this.formGroup.get('validThrough');
    if (validFromControl) {
      validFromControl.valueChanges
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((value) => {
          this.validThrough = value;
          this.defaultValidFrom = this.validThrough
            ? addDays(this.validThrough, -30)
            : undefined;
        });
    } else {
      console.error(`Control with name 'validThrough' not found in the form.`);
    }
  }

  private handleSuccess(): void {
    this.success = true;
    this.errorMessage = '';
    this.reset();

    this.goToDiscountsPage();
  }

  private handleError(err: any): void {
    this.success = false;
    this.errorMessage = (err as Error).message;
    this.reset();
  }

  private reset(): void {
    // Reset loading states
    this.loading = false;
    this.loaderService.setLoading(false);

    // Reset form
    this.enableForm();
  }

  private disableForm() {
    for (const control of Object.values(this.formGroup.controls)) {
      control.disable();
    }
  }

  private enableForm() {
    for (const control of Object.values(this.formGroup.controls)) {
      control.enable();
    }
  }

  private static getSelectedDays(daysAvailable: boolean[]): DayOfWeek[] {
    return daysAvailable.reduce(
      (acc: DayOfWeek[], daySelected: boolean, index: number) => {
        if (daySelected) {
          acc.push(Object.values(DayOfWeek)[index]);
        }
        return acc;
      },
      []
    );
  }

  private static getTime(date: Date) {
    if (!(date instanceof Date)) return date;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private static createDateFromTimeString(timeString: string) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
}
