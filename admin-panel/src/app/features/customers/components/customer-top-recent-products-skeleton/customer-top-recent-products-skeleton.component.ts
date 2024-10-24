import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-customer-top-recent-products-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './customer-top-recent-products-skeleton.component.html',
  styleUrl: './customer-top-recent-products-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTopRecentProductsSkeletonComponent {}
