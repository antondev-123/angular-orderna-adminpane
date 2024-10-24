import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {
  ActivatedRoute,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import { InputDateRangeComponent } from '@orderna/admin-panel/src/app/shared/components/input/daterange/daterange.component';
import { InputFilterImmediateComponent } from '@orderna/admin-panel/src/app/shared/components/input/filter-immediate/filter-immediate.component';
import { PaginationComponent } from '@orderna/admin-panel/src/app/shared/components/pagination/pagination.component';
import { RowControlComponent } from '@orderna/admin-panel/src/app/shared/components/row-controls/row-controls.component';
import { TableSkeletonComponent } from '@orderna/admin-panel/src/app/shared/components/table/table-skeleton.component';
import { TableComponent } from '@orderna/admin-panel/src/app/shared/components/table/table.component';
import { IStore } from '@orderna/admin-panel/src/app/model/store';
import { ITipsByDay } from '@orderna/admin-panel/src/app/model/tips-by-day';
import { StoresDataSource } from '@orderna/admin-panel/src/app/services/data-sources/stores.dataSource';
import { TipsByDaysDataSource } from '@orderna/admin-panel/src/app/services/data-sources/tips-by-days.dataSource';
import { StoresApiService } from '@orderna/admin-panel/src/app/core/stores/stores-api.service';
import { TipsByDaysApiService } from '@orderna/admin-panel/src/app/services/sales-analytics/tips-by-days/tips-by-days-api.service';
import { ChartOptions } from '@orderna/admin-panel/src/types/chart-options';
import { DateFilter } from '@orderna/admin-panel/src/types/date-filter';
import { FilterOptionItem } from '@orderna/admin-panel/src/types/filter';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import {
  DEFAULT_QUERY_OPTIONS,
  QueryOptions,
  toQueryOptions,
} from '@orderna/admin-panel/src/types/query-options';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import { TableTotal } from '@orderna/admin-panel/src/types/table-total';
import { CHART_TOOLBAR_OPTIONS } from '@orderna/admin-panel/src/utils/chart-options';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
} from 'rxjs';

interface PageData {
  isLoading: boolean;
  totalRecords: number;
  storeFilterOptions: FilterOptionItem<IStore['id']>[];
}
@Component({
  selector: 'app-tips-by-day',
  standalone: true,
  imports: [
    CommonModule,

    InputFilterImmediateComponent,
    InputDateRangeComponent,

    TableComponent,
    TableSkeletonComponent,
    RowControlComponent,
    PaginationComponent,

    NgApexchartsModule,
  ],
  templateUrl: './tips-by-day.component.html',
  styleUrl: './tips-by-day.component.css',
})
export class TipsByDayComponent implements OnInit {
  readonly columns: TableColumn<ITipsByDay>[] = [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'tips', label: 'Tips Revenue', type: 'currency' },
  ];

  summaryTotals: TableTotal<ITipsByDay>[] = [];

  chartOptions: Partial<ChartOptions>;

  queryOptions!: QueryOptions<ITipsByDay>;
  fallbackQueryOptions: QueryOptions<ITipsByDay> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'id', direction: 'desc' },
  };

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  initialStoreFilterValue: IStore['id'][] = [];
  initialStartDate: Date = new Date();
  initialEndDate: Date = new Date();

  storesDataSource = new StoresDataSource(this.storesService);
  storeNames$ = this.storesDataSource.storeNames$.asObservable();

  tipsByDaysDataSource = new TipsByDaysDataSource(this.tipsByDayService);
  tipsByDays$ = this.tipsByDaysDataSource.tipsByDays$.asObservable();
  isLoading$ = this.tipsByDaysDataSource.isLoading$.asObservable();
  totalTipsByDays$ = this.tipsByDaysDataSource.totalTipsByDays$.asObservable();
  tipsByDaySummary$ =
    this.tipsByDaysDataSource.tipsByDaySummary$.asObservable();
  tipsByDayChartData$ =
    this.tipsByDaysDataSource.tipsByDayChartData$.asObservable();

  data$!: Observable<PageData>;

  customPresets = [
    'Today',
    'Yesterday',
    'This month',
    'Last month',
    'This year',
    'Last year',
    'All time',
  ];

  errorMessage: string = '';
  infoMessage?: string = '';

  @ViewChild(TableComponent) table!: TableComponent<ITipsByDay>;

  constructor(
    private tipsByDayService: TipsByDaysApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.chartOptions = {
      title: {
        text: 'Tip revenue',
        align: 'left',
      },
      series: [
        {
          name: 'Tip',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: CHART_TOOLBAR_OPTIONS,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [],
      },
      yaxis: {},
      fill: {
        opacity: 1,
      },
    };
  }

  ngOnInit(): void {
    this.storesDataSource.loadStoreNames();
    this.tipsByDaysDataSource.loadTotalTipsByDays();

    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const optionalParamKeys = ['store', 'perPage'];
        const { queryOptions, error } = toQueryOptions(
          params,
          this.fallbackQueryOptions,
          optionalParamKeys
        );

        if (!queryOptions || queryOptions?.dateFilter === DateFilter.MAX) {
          this.updateQueryParams({
            dateFilter: `${this.dateAdapter.format(
              new Date(),
              'shortDate'
            )}_${this.dateAdapter.format(new Date(), 'shortDate')}`,
          });
        } else {
          const [start, end] = queryOptions!.dateFilter!.split('_');
          this.initialStartDate = new Date(start);
          this.initialEndDate = new Date(end);
        }

        if (queryOptions?.filters?.find((f) => f.field === 'perPage')) {
          queryOptions.perPage = +queryOptions?.filters?.find(
            (f) => f.field === 'perPage'
          )?.value!;
        }

        if (error) throw error;

        this.queryOptions = queryOptions!;

        this.tipsByDaysDataSource.loadTipsByDays(this.queryOptions);
        this.tipsByDaysDataSource.loadTipsByDaySummary();
        this.tipsByDaysDataSource.loadTipsByDayChartData();

        return combineLatest([
          this.isLoading$,
          this.totalTipsByDays$,
          this.storeNames$,
        ]).pipe(
          map(([isLoading, totalRecords, storeNames]) => ({
            isLoading,
            totalRecords,
            storeFilterOptions: [
              ...storeNames.map((store) => ({
                value: store.id,
                label: store.name,
              })),
            ],
          })),
          catchError(() => {
            this.errorMessage = 'Error while compiling transaction data';
            return of({
              isLoading: false, // Default fallback values
              totalRecords: 0,
              storeFilterOptions: [],
            });
          })
        );
      }),
      catchError((error) => {
        console.log(error);
        this.errorMessage = error.message;
        this.cdr.detectChanges();
        return of();
      })
    );

    this.tipsByDaySummary$.subscribe((summary) => {
      this.summaryTotals = [
        { field: 'date', isLabel: true, value: 'Summary' },
        { field: 'tips', isLabel: false, value: summary?.tips ?? 0 },
      ];
    });

    this.tipsByDayChartData$.subscribe((data) => {
      this.chartOptions.series = [
        { name: 'Tips', data: data?.map((d) => d.tips) ?? [] },
      ];

      this.chartOptions.xaxis = {
        categories: data?.reduce((acc: string[], d) => {
          const month =
            this.dateAdapter.getMonthNames('short')[
              this.dateAdapter.getMonth(d.date)
            ];
          acc.push(`${d.date.getDate()} ${month}`);
          return acc;
        }, []),
      };
    });
  }

  handleStoreFilter(filter?: IStore['id'][]) {
    this.updateQueryParams({ store: filter });
  }

  handleDateFilter(filter?: string) {
    this.updateQueryParams({ dateFilter: filter });
  }

  handleSort(sort?: QueryOptions<ITipsByDay>['sort']) {
    if (sort) {
      const { field, direction } = sort;
      console.log(`Sorting ${field} in ${direction}ending order`);
      this.updateQueryParams({ sort: `${field}_${direction}` });
    } else {
      console.log(`Sorting cleared`);
      this.updateQueryParams({ sort: undefined });
    }
  }

  updateQueryParams(
    updatedParams: Maybe<Params>,
    handling: QueryParamsHandling = 'merge'
  ) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedParams,
      queryParamsHandling: handling,
      replaceUrl: false, // adds new history to URL
    });
  }
}
