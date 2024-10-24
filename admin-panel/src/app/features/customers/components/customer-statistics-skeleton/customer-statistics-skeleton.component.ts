import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-customer-statistics-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './customer-statistics-skeleton.component.html',
  styleUrl: './customer-statistics-skeleton.component.scss',
})
export class CustomerStatisticsSkeletonComponent {}
