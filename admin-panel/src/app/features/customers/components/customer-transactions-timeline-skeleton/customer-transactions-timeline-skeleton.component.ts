import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import {
  TimelineComponent,
  TimelineContentDirective,
} from '../../../../shared/components/timeline/timeline.component';

@Component({
  selector: 'app-customer-transactions-timeline-skeleton',
  standalone: true,
  imports: [SkeletonComponent, TimelineComponent, TimelineContentDirective],
  templateUrl: './customer-transactions-timeline-skeleton.component.html',
  styleUrl: './customer-transactions-timeline-skeleton.component.scss',
})
export class CustomerTransactionsTimelineSkeletonComponent {
  // 10 dummy transaction with status set to 'pending' so timeline marker is gray
  transactions = Array(10).fill({ status: 'pending' });
}
