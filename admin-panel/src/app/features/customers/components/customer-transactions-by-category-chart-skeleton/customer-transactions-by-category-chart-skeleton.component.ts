import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-customer-transactions-by-category-chart-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl:
    './customer-transactions-by-category-chart-skeleton.component.html',
  styleUrl: './customer-transactions-by-category-chart-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTransactionsByCategoryChartSkeletonComponent {}
