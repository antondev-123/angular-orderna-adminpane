import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlatpickrModule } from 'angularx-flatpickr';
import {
  MatDateRangePicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { InputDateRangeHeaderComponent } from './header/header.component';
import { InputDateRangeService } from './daterange.service';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../button/button.component';

@Component({
  selector: 'app-input-datepicker',

  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    FlatpickrModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    InputDateRangeHeaderComponent,
    ButtonComponent,
    ButtonTextDirective,
  ],
  providers: [InputDateRangeService],
  templateUrl: './daterange.component.html',
  styleUrls: ['../input.component.scss', './daterange.component.scss'],
})
export class InputDateRangeComponent {
  @Input() customPresets: string[] = [];
  @Input() start: Date = new Date();
  @Input() end: Date = new Date();
  CustomHeaderComponent = InputDateRangeHeaderComponent;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  @Output() filterChange = new EventEmitter<any>();

  isTouchUIActivated = false;

  constructor(
    public pickerService: InputDateRangeService,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit() {
    this.pickerService.customPresets = this.customPresets;

    this.range.setValue({
      start: this.start,
      end: this.end,
    });
  }

  private get today() {
    const today = new Date(); //.getValidDateOrNull(new Date());
    if (today === null) {
      throw new Error('date creation failed');
    }
    return today;
  }

  cancel(picker: MatDateRangePicker<Date>) {
    picker.close();
  }

  applySelectedDate(picker: MatDateRangePicker<Date>) {
    picker._applyPendingSelection();
    this.range.setValue({
      start: (picker.datepickerInput as any).value.start,
      end: (picker.datepickerInput as any).value.end,
    });

    const { start, end } = this.range.value;

    const filter = `${this.dateAdapter.format(
      start,
      'shortDate'
    )}_${this.dateAdapter.format(end, 'shortDate')}`;
    this.filterChange.emit(filter);
    picker.close();
  }
}
