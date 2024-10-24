import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BreakDto } from '@orderna/admin-panel/src/app/model/break';

@Component({
  selector: 'app-break-summary',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './break-summary.component.html',
  styleUrl: './break-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreakSummaryComponent {
  breaks = input.required<BreakDto[]>();

  getMins(breakTime: BreakDto): number {
    return Math.round(
      (breakTime.end.getTime() - breakTime.start.getTime()) / (1000 * 60)
    );
  }
}
