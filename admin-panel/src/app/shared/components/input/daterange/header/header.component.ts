import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';
import { InputDateRangePanelComponent } from '../range-panel/range-panel.component';
import { InputDateRangeService } from '../daterange.service';

@Component({
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [InputDateRangePanelComponent, MatDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateRangeHeaderComponent<D> implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private calendar: MatCalendar<D>, // calendar instance of picker
    cdr: ChangeDetectorRef,
    public pickerService: InputDateRangeService
  ) {
    // make sure your header stays in sync with the calendar:
    calendar.stateChanges
      .pipe(takeUntil(this.destroy$)) // unsubscribe when destroyed
      .subscribe(() => {
        cdr.markForCheck();
        setTimeout(() =>
          this.pickerService.applyDisabled.next(
            !(this.calendar.selected as any).start ||
              !(this.calendar.selected as any).end
          )
        );
      });
    //this.headerService.subj$.subscribe((res: string[]) => console.log(res));
  }
  ngOnDestroy(): void {
    this.destroy$.next(); // will trigger unsubscription in takeUntil
  }
}
