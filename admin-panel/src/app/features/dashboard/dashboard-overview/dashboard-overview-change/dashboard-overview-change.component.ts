import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-overview-change',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './dashboard-overview-change.component.html',
  styleUrl: './dashboard-overview-change.component.css',
})
export class DashboardOverviewChangeComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() valueIsCurrency?: boolean = false;
  @Input() from: number = 0;
  @Input() percent: number = 0;
}
