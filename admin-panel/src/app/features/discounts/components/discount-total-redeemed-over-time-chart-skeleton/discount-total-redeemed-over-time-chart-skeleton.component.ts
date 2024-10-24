import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-discount-total-redeemed-over-time-chart-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl:
    './discount-total-redeemed-over-time-chart-skeleton.component.html',
  styleUrl: './discount-total-redeemed-over-time-chart-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountTotalRedeemedOverTimeChartSkeletonComponent {}
