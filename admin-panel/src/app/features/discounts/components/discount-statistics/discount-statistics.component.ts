import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DateAgoPipe } from '../../../../common/pipes/date-ago/date-ago.pipe';
import { DiscountStatistics } from '../../../../model/discount';

@Component({
  selector: 'app-discount-statistics',
  standalone: true,
  imports: [CommonModule, DateAgoPipe],
  templateUrl: './discount-statistics.component.html',
  styleUrl: './discount-statistics.component.scss',
})
export class DiscountStatisticsComponent {
  @Input('data') statistics!: DiscountStatistics;
}
