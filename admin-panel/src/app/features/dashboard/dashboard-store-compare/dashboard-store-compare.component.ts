import { Component, OnInit, ViewChild } from '@angular/core';
import { MatOption, MatSelect } from '@angular/material/select';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  NgApexchartsModule,
  ApexTooltip,
  ApexNoData,
  ApexYAxis,
  ApexFill,
  ApexLegend,
} from 'ng-apexcharts';
import { IStore } from '../../../model/store';
import { FilterOptionItem } from '../../../../types/filter';
import { InputFilterImmediateComponent } from '../../../shared/components/input/filter-immediate/filter-immediate.component';
import { StoresApiService } from '../../../core/stores/stores-api.service';
import { CHART_TOOLBAR_OPTIONS } from '@orderna/admin-panel/src/utils/chart-options';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  noData: ApexNoData;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-dashboard-store-compare',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MatSelect,
    MatOption,
    InputFilterImmediateComponent,
  ],
  templateUrl: './dashboard-store-compare.component.html',
  styleUrl: './dashboard-store-compare.component.css',
})
export class DashboardStoreCompareComponent implements OnInit {
  @ViewChild('chart', { static: false }) chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  stores: FilterOptionItem<IStore['id'] | 'empty'>[] = [];

  constructor(private storesService: StoresApiService) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        stackOnlyBar: false,
        toolbar: CHART_TOOLBAR_OPTIONS,
      },
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        categories: [],
      },
    };
  }

  ngOnInit(): void {
    this.storesService.getStoreNames().subscribe({
      next: (data:any) => {
        this.stores = (data.data ?? []).map((store:any) => ({
          label: store.name,
          value: store.id,
        }));
      },
    });
  }

  storeSelect(option: number[]) {
    if (option.length < 2) {
      this.chartOptions.xaxis!.categories = [];
      this.chartOptions.series = [];
      return;
    }

    this.storesService.compareStores(option).subscribe((storeDatas) => {
      if (!storeDatas) {
        return;
      }

      const storeNames = storeDatas.map((storeData) => storeData.storeName);
      const gross = storeDatas.map((storeData) => storeData.gross);
      const expense = storeDatas.map((storeData) => storeData.expense);
      const net = storeDatas.map((storeData) => storeData.net);

      this.chartOptions.xaxis = {
        ...this.chartOptions.xaxis,
        categories: storeNames,
      };
      this.chartOptions.series = [
        {
          name: 'Gross',
          group: 'group1',
          data: gross,
        },
        {
          name: 'Expense',
          group: 'group1',
          data: expense,
        },
        {
          name: 'Net',
          group: 'group2',
          data: net,
        },
      ];
    });
  }
}
