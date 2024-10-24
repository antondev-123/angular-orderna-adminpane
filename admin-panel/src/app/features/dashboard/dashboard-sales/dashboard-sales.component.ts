import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { BehaviorSubject } from 'rxjs';
import { IDashboardFilter } from '../dashboard-header/dashboard-header.component';
import { CommonModule } from '@angular/common';
import { ITotalSales } from '../../../model/product';
import { SalesApiService } from '../../../services/sales/sales-api.service';
import { CHART_TOOLBAR_OPTIONS } from '@orderna/admin-panel/src/utils/chart-options';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard-sales',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard-sales.component.html',
  styleUrl: './dashboard-sales.component.css',
})
export class DashboardSalesComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input() dashboardFilter!: BehaviorSubject<IDashboardFilter>;

  errorMessage?: string;

  constructor(private salesService: SalesApiService) {
    this.chartOptions = {
      series: [
        {
          name: 'Sales',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        toolbar: CHART_TOOLBAR_OPTIONS,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + '₱';
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
      },
      xaxis: {
        categories: [],
        position: 'bottom',
      },
    };
  }

  ngOnInit(): void {
    this.dashboardFilter.subscribe((filter) => {
      this.errorMessage = undefined;
      console.log('FILTER UPDATED ', filter);

      if (filter?.storeId === 'empty' || filter?.storeId === null) {
        this.updateChart([]);
        return;
      }

      this.salesService.getTotalSales(filter).subscribe((totalSales) => {
        if (!totalSales || totalSales?.length === 0) {
          this.errorMessage = 'No data found';
          return;
        }

        this.updateChart(totalSales);
      });
    });
  }

  private updateChart(totalSales: ITotalSales[]) {
    this.chartOptions.series = [
      {
        name: 'Sales',
        data: totalSales.map((sales) => sales.totalSold),
      },
    ];
    this.chartOptions.xaxis = {
      categories: totalSales.map((sales) => this.formatDate(sales.date)),
    };
  }

  private formatDate(date: Date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return `${day} ${month}`;
  }
}
