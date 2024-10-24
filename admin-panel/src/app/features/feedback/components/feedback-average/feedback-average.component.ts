import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  IFeedbackOverTime,
  IFeedbackFilter,
  IFeedbackFilterState,
} from '@orderna/admin-panel/src/app/model/feedback';
import { FeedbackAverageDataSource } from '@orderna/admin-panel/src/app/services/data-sources/feedback-average.dataSource';
import { FeedbackFilterStateService } from '@orderna/admin-panel/src/app/services/feedback/feedback-filter-state.service';
import { FeedbacksApiService } from '@orderna/admin-panel/src/app/services/feedbacks/feedbacks-api.service';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { InputDatePickerComponent } from '@orderna/admin-panel/src/app/shared/components/input/datepicker/datepicker.component';
import { InputFilterImmediateComponent } from '@orderna/admin-panel/src/app/shared/components/input/filter-immediate/filter-immediate.component';
import { TableComponent } from '@orderna/admin-panel/src/app/shared/components/table/table.component';
import { DateGroup } from '@orderna/admin-panel/src/types/date-group';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import { CHART_TOOLBAR_OPTIONS } from '@orderna/admin-panel/src/utils/chart-options';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexFill,
  ApexTitleSubtitle,
  ApexResponsive,
  NgApexchartsModule,
  ChartComponent,
} from 'ng-apexcharts';
import {
  Observable,
  switchMap,
  combineLatest,
  map,
  catchError,
  of,
} from 'rxjs';

interface PageData {
  isLoading: boolean;
  feedbackChartData: IFeedbackOverTime[];
}

type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-feedback-average',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputDatePickerComponent,
    InputFilterImmediateComponent,
    MatIconModule,
    ButtonComponent,
    ButtonTextDirective,
    NgApexchartsModule,
    TableComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './feedback-average.component.html',
  styleUrl: './feedback-average.component.css',
})
export class FeedbackAverageComponent implements OnInit, OnDestroy {
  @ViewChild('chart', { static: false }) chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  date: Maybe<Date>;
  formGroup!: FormGroup;

  errorMessage?: string;
  infoMessage?: string;

  data$!: Observable<PageData>;

  feedbackAverageDataSource = new FeedbackAverageDataSource(
    this.feedbacksService
  );
  feedbackChartData$ = this.feedbackAverageDataSource.feedbacks$.asObservable();
  isLoading$ = this.feedbackAverageDataSource.isLoading$.asObservable();
  feedbackFilter?: IFeedbackFilter;

  readonly columns: TableColumn<IFeedbackOverTime>[] = [
    {
      key: 'createdAt',
      type: 'string',
      label: 'Date',
      getValue: (feedback) => this.formatLable(feedback),
    },
    {
      key: 'average',
      type: 'number',
      label: 'Average',
    },
    {
      key: 'total',
      type: 'number',
      label: 'Total Reviews',
    },
  ];
  constructor(
    private feedbacksService: FeedbacksApiService,
    private feedbackFilterStateService: FeedbackFilterStateService,
    private cdr: ChangeDetectorRef
  ) {
    this.chartOptions = {
      series: [
        {
          name: 'Feedback',
          data: [],
        },
      ],
      chart: {
        height: 500,
        type: 'bar',
        width: '100%',
        toolbar: CHART_TOOLBAR_OPTIONS,
        zoom: {
          enabled: false,
        },
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 300,
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 250,
            },
          },
        },
      ],
      xaxis: {
        categories: [],
        position: 'bottom',
        labels: {
          offsetY: -5,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      title: {
        text: 'Average rating over time',
        align: 'center',
      },
    };
  }

  ngOnInit() {
    this.data$ = this.feedbackFilterStateService.filterState$.pipe(
      switchMap(
        (searchFilter: Omit<IFeedbackFilterState, 'storeFilterOptions'>) => {
          this.feedbackFilter = searchFilter;
          this.feedbackAverageDataSource.loadData({ ...searchFilter });
          return combineLatest([
            this.isLoading$,
            this.feedbackAverageDataSource.feedbacks$,
          ]).pipe(
            map(([isLoading, feedbacks]) => {
              this.updateChartOptions(feedbacks);
              return { isLoading, feedbackChartData: feedbacks };
            }),
            catchError(this.handleError.bind(this))
          );
        }
      ),
      catchError(this.handleError.bind(this))
    );
  }

  ngOnDestroy(): void {
    this.feedbackAverageDataSource.disconnect();
  }

  private updateChartOptions(feedbacks: IFeedbackOverTime[]): void {
    const categories = feedbacks.map((feedback) => this.formatLable(feedback));
    const chartData = feedbacks.map((feedback) => feedback.average);

    this.chartOptions = {
      ...this.chartOptions,
      xaxis: { ...this.chartOptions.xaxis, categories },
      series: [{ name: 'Feedback', data: chartData }],
    };
  }

  private handleError(error: any): Observable<never> {
    this.errorMessage = error.message;
    this.cdr.detectChanges();
    return of();
  }

  private formatLable(feedbackOverTime: IFeedbackOverTime) {
    if (
      this.feedbackFilter?.dateGroup &&
      (this.feedbackFilter?.dateGroup === DateGroup.YEAR ||
        this.feedbackFilter?.dateGroup == DateGroup.MONTH)
    ) {
      return this.formatDate(feedbackOverTime.createdAt);
    }

    if (feedbackOverTime.groupedValues) {
      return `${this.formatDate(
        feedbackOverTime.groupedValues.startDate
      )}-${this.formatDate(feedbackOverTime.groupedValues.endDate)}`;
    }

    return this.formatDate(feedbackOverTime.createdAt);
  }

  private formatDate(value: Date): string {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const paddedMonth = month < 10 ? `0${month}` : `${month}`;
    const paddedDay = day < 10 ? `0${day}` : `${day}`;

    if (
      this.feedbackFilter?.dateGroup &&
      this.feedbackFilter?.dateGroup === DateGroup.YEAR
    ) {
      return `${year}`;
    } else if (
      this.feedbackFilter?.dateGroup &&
      this.feedbackFilter?.dateGroup === DateGroup.MONTH
    ) {
      return `${year}/${paddedMonth}`;
    }

    return `${year}/${paddedMonth}/${paddedDay}`;
  }
}
