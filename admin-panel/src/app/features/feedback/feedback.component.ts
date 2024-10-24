import { Component, signal } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { FeedbackAverageComponent } from './components/feedback-average/feedback-average.component';
import { FeedbackHeaderComponent } from './components/feedback-header/feedback-header.component';
import { FeedbackOverviewComponent } from './components/feedback-overview/feedback-overview.component';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    MatTabsModule,
    FeedbackOverviewComponent,
    FeedbackAverageComponent,
    FeedbackHeaderComponent,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent {
  selectedTab = signal<number>(0);
  onTabChange(event: MatTabChangeEvent) {
    this.selectedTab.set(event.index);
  }
}
