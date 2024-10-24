import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewChild,
} from '@angular/core';
import { ChartOptions } from '@orderna/admin-panel/src/types/chart-options';
import { CHART_TOOLBAR_OPTIONS } from '@orderna/admin-panel/src/utils/chart-options';
import {
  ApexAxisChartSeries,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

@Component({
  selector: 'app-discount-total-redeemed-over-time-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './discount-total-redeemed-over-time-chart.component.html',
  styleUrl: './discount-total-redeemed-over-time-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountTotalRedeemedOverTimeChartComponent {
  @ViewChild('chart') chartComponent!: ChartComponent;

  readonly chart: ChartOptions['chart'] = {
    height: 350,
    type: 'bar',
    toolbar: CHART_TOOLBAR_OPTIONS,
  };

  data = input.required<ApexAxisChartSeries[0]['data']>();
  labels = input.required<ChartOptions['labels'], Date[]>({
    transform: (labels) => labels.map((l) => this.formatDate(l)),
  });

  series = computed<ChartOptions['series']>(() => [
    {
      name: 'Total Redeemed',
      data: this.data(),
    },
  ]);

  private formatDate(date: Date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return `${day} ${month}`;
  }
}
