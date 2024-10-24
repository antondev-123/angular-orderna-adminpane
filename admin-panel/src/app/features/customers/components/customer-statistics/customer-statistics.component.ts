import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DateAgoPipe } from '../../../../common/pipes/date-ago/date-ago.pipe';
import { CustomerStatistics } from '../../../../model/customer';

@Component({
  selector: 'app-customer-statistics',
  standalone: true,
  imports: [CommonModule, DateAgoPipe],
  templateUrl: './customer-statistics.component.html',
  styleUrl: './customer-statistics.component.scss',
})
export class CustomerStatisticsComponent {
  @Input('data') statistics!: CustomerStatistics;
}
