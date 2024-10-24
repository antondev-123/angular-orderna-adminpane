import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { IFeedbackFilterState } from '@orderna/admin-panel/src/app/model/feedback';
import { IStore } from '@orderna/admin-panel/src/app/model/store';
import { FeedbackFilterStateService } from '@orderna/admin-panel/src/app/services/feedback/feedback-filter-state.service';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { InputDatePickerComponent } from '@orderna/admin-panel/src/app/shared/components/input/datepicker/datepicker.component';
import { InputFilterImmediateComponent } from '@orderna/admin-panel/src/app/shared/components/input/filter-immediate/filter-immediate.component';
import { DateGroup } from '@orderna/admin-panel/src/types/date-group';
import { FEEDBACK_AVERAGE_GROUP_FILTER_OPTIONS } from '@orderna/admin-panel/src/utils/constants/filter-options';
import { FlatPickrOutputOptions } from 'angularx-flatpickr/lib/flatpickr.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feedback-header',
  standalone: true,
  imports: [
    CommonModule,
    InputFilterImmediateComponent,
    ButtonComponent,
    InputDatePickerComponent,
    FormsModule,
    ReactiveFormsModule,
    InputDatePickerComponent,
    MatIconModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './feedback-header.component.html',
  styleUrl: './feedback-header.component.css',
})
export class FeedbackHeaderComponent implements OnInit, OnDestroy {
  @Input() header!: string;
  @Input() hasGroupFilter: boolean = false;

  formGroup!: FormGroup;

  errorMessage?: string;
  infoMessage?: string;

  filterState?: IFeedbackFilterState;
  readonly groupOptions = FEEDBACK_AVERAGE_GROUP_FILTER_OPTIONS;
  subscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private feedbackFilterStateService: FeedbackFilterStateService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      dateRangeFilter: {
        from: null,
        to: null,
      },
    });
    this.subscription = this.feedbackFilterStateService.filterState$.subscribe(
      (newFilterState) => {
        this.filterState = newFilterState;
        this.formGroup.patchValue({
          dateRangeFilter: {
            from: newFilterState.dateRangeFilter?.from,
            to: newFilterState.dateRangeFilter?.to,
          },
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleDateChange(datePickValue: Partial<FlatPickrOutputOptions>) {
    if (datePickValue.selectedDates?.length !== 2) {
      return;
    }

    this.feedbackFilterStateService.handleDateRangeChange(datePickValue);
  }

  handleStoreFilter(filter?: IStore['id'] | 'empty') {
    this.formGroup.patchValue({
      ...this.formGroup.value,
    });
    this.feedbackFilterStateService.handleStoreFilter(filter);
  }

  handleGroupFilter(group: DateGroup) {
    this.feedbackFilterStateService.handleGroupFilter(group);
  }

  get initialStoreFilterValue() {
    return 'empty';
  }
}
