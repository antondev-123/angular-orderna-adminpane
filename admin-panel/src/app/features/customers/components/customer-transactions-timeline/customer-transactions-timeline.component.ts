import { Component, Input } from '@angular/core';
import {
  TimelineComponent,
  TimelineContentDirective,
} from '../../../../shared/components/timeline/timeline.component';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../../model/transaction';

@Component({
  selector: 'app-customer-transactions-timeline',
  standalone: true,
  imports: [CommonModule, TimelineComponent, TimelineContentDirective],
  templateUrl: './customer-transactions-timeline.component.html',
  styleUrl: './customer-transactions-timeline.component.scss',
})
export class CustomerTransactionsTimelineComponent {
  @Input('data') transactions!: Transaction[];
}
