import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter } from '@angular/material/core';
import { MatCalendar, MatDateRangePicker } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';

const customPresets = [
  'today',
  'yesterday',
  'this month',
  'last month',
  'this year',
  'last year',
  'all time',
] as const; // convert to readonly tuple of string literals

// equivalent to "today" | "yesterday" | ... | "last year"
type CustomPreset = (typeof customPresets)[number];

@Component({
  selector: 'app-input-datepicker-range-panel',
  templateUrl: './range-panel.component.html',
  styleUrls: ['./range-panel.component.scss'],
  standalone: true,
  imports: [MatCardModule, CommonModule, MatCalendar],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateRangePanelComponent<D> {
  // list of range presets we want to provide:
  @Input() customPresets: string[] = [];
  @HostBinding('class.touch-ui')
  readonly isTouchUi = this.picker.touchUi;
  selectedRange: CustomPreset = customPresets[0];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private dateAdapter: DateAdapter<D>,
    private picker: MatDateRangePicker<D>,
    private calendar: MatCalendar<D>,
    cdr: ChangeDetectorRef
  ) {
    calendar.stateChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      cdr.markForCheck();
      this.loadSelectedRange();
    });
  }

  ngOnInit() {
    this.loadSelectedRange();
  }

  loadSelectedRange() {
    this.selectedRange = customPresets[0];
    for (const preset of this.customPresets) {
      if (this.isSelectdeRange(preset)) {
        this.selectedRange = preset as CustomPreset;
        break;
      }
    }
  }

  // called when user selects a range preset:
  selectRange(rangeName: string): void {
    if (rangeName === 'Custom') return;
    const [start, end] = this.calculateDateRange(rangeName);
    (this.calendar.selected as any).start = start;
    (this.calendar.selected as any).end = end;
    this.calendar.updateTodaysDate();
    this.calendar.activeDate = start;
    this.calendar.activeDate = end;
    // this.picker.select(start);
    // this.picker.select(end);
    // this.picker.close();
  }

  private calculateDateRange(rangeName: string): [start: D, end: D] {
    const today = this.today;
    const year = this.dateAdapter.getYear(today);

    switch (rangeName) {
      case 'Today':
        return [today, today];
      case 'Yesterday': {
        const start = this.dateAdapter.addCalendarDays(today, -1);
        return [start, start];
      }
      case 'This month': {
        return this.calculateMonth(today);
      }
      case 'Last month': {
        const thisDayLastMonth = this.dateAdapter.addCalendarMonths(today, -1);
        return this.calculateMonth(thisDayLastMonth);
      }
      case 'This year': {
        const start = this.dateAdapter.createDate(year, 0, 1);
        const end = this.dateAdapter.createDate(
          year,
          11,
          this.dateAdapter.getNumDaysInMonth(
            this.dateAdapter.addCalendarMonths(start, 10)
          ) + 1
        );
        return [start, end];
      }
      case 'Last year': {
        const start = this.dateAdapter.addCalendarYears(
          this.dateAdapter.createDate(year, 0, 1),
          -1
        );
        const end = this.dateAdapter.createDate(
          this.dateAdapter.getYear(start),
          11,
          this.dateAdapter.getNumDaysInMonth(
            this.dateAdapter.addCalendarMonths(start, 10)
          ) + 1
        );
        return [start, end];
      }
      case 'All time': {
        const start = this.dateAdapter.createDate(0, 0, 1);
        const end = today;

        return [start, end];
      }
      case 'Custom': {
        const selectedRange: any = this.calendar.selected;
        return [selectedRange.start, selectedRange.end];
      }
      default:
        return [today, today];
    }
  }

  private calculateMonth(forDay: D): [start: D, end: D] {
    const year = this.dateAdapter.getYear(forDay);
    const month = this.dateAdapter.getMonth(forDay);
    const start = this.dateAdapter.createDate(year, month, 1);
    const end = this.dateAdapter.addCalendarDays(
      start,
      this.dateAdapter.getNumDaysInMonth(forDay) - 1
    );
    return [start, end];
  }

  private calculateWeek(forDay: D): [start: D, end: D] {
    const deltaStart =
      this.dateAdapter.getFirstDayOfWeek() -
      this.dateAdapter.getDayOfWeek(forDay);
    const start = this.dateAdapter.addCalendarDays(forDay, deltaStart);
    const end = this.dateAdapter.addCalendarDays(start, 6);
    return [start, end];
  }

  private get today(): D {
    const today = this.dateAdapter.today(); //.getValidDateOrNull(new Date());
    if (today === null) {
      throw new Error('date creation failed');
    }
    return today;
  }
  get selectedDateRange() {
    const selectedRange: any = this.calendar.selected;
    let displayText = '';
    if (selectedRange.start !== null)
      displayText += new Date(String(selectedRange.start)).toLocaleDateString();
    if (selectedRange.end !== null)
      displayText +=
        ' - ' + new Date(String(selectedRange.end)).toLocaleDateString();
    return displayText;
  }

  ngOnDestroy() {
    this.destroy$.next(); // will trigger unsubscription in takeUntil
  }

  isSelectdeRange(rangeName: string) {
    const [start, end] = this.calculateDateRange(rangeName);
    const selectedRange: any = this.calendar.selected;
    return (
      selectedRange.start !== null &&
      selectedRange.end !== null &&
      new Date(String(selectedRange.start)).toDateString() ===
        new Date(String(start)).toDateString() &&
      new Date(String(selectedRange.end)).toDateString() ===
        new Date(String(end)).toDateString()
    );
  }
}
