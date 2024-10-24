import { Component, input, OnInit } from '@angular/core';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { range } from '@orderna/admin-panel/src/utils/range';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SubscriptionManager } from '@orderna/admin-panel/src/utils/subscription-manager';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './table-skeleton.component.html',
  styleUrl: './table.component.scss',
})
export class TableSkeletonComponent
  extends SubscriptionManager
  implements OnInit
{
  rowsCount = input<number>(10);
  hideHeader = input<boolean>(false);

  range = range;

  constructor(private responsive: BreakpointObserver) {
    super();
  }

  isPhonePortrait = false;

  get columnsCount() {
    return this.isPhonePortrait ? 3 : 5;
  }

  ngOnInit() {
    this.responsive
      .observe(Breakpoints.HandsetPortrait)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.isPhonePortrait = false;
        if (result.matches) {
          this.isPhonePortrait = true;
        }
      });
  }
}
