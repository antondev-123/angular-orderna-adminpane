import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewChild,
} from '@angular/core';
import { ChartOptions } from '@orderna/admin-panel/src/types/chart-options';
import { CHART_TOOLBAR_OPTIONS } from '@orderna/admin-panel/src/utils/chart-options';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-customer-transactions-by-category-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './customer-transactions-by-category-chart.component.html',
  styleUrl: './customer-transactions-by-category-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTransactionsByCategoryChartComponent {
  @ViewChild('chart') chartComponent!: ChartComponent;

  series = input<ChartOptions['series']>([]);
  labels = input<ChartOptions['labels']>([]);
  chart: ChartOptions['chart'] = {
    width: 380,
    type: 'pie',
    events: {
      mounted: (chartContext, config) => {
        this.addCustomLegendLabel();
      },
      updated: (chartContext, config) => {
        this.addCustomLegendLabel();
      },
    },
    toolbar: CHART_TOOLBAR_OPTIONS,
  };
  responsive: ChartOptions['responsive'] = [
    {
      breakpoint: 1400,
      options: {
        chart: {
          width: 380,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ];

  addCustomLegendLabel() {
    const legendElement = document.querySelector('.apexcharts-legend');
    if (legendElement) {
      const customLabel = document.createElement('p');
      customLabel.textContent = 'Categories';
      customLabel.style.marginRight = '10px';
      customLabel.style.fontWeight = 'bold';
      legendElement.insertBefore(customLabel, legendElement.firstChild);
    }
  }
}
