import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-discount-statistics-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './discount-statistics-skeleton.component.html',
  styleUrl: './discount-statistics-skeleton.component.scss',
})
export class DiscountStatisticsSkeletonComponent {}
