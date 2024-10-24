import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
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
import { IDayOfWeekSale } from '@orderna/admin-panel/src/app/model/day-of-week-sale';
import { IStore } from '@orderna/admin-panel/src/app/model/store';
import { DayOfWeekSalesDataSource } from '@orderna/admin-panel/src/app/services/data-sources/day-of-week-sales.dataSource';
import { StoresDataSource } from '@orderna/admin-panel/src/app/services/data-sources/stores.dataSource';
import { DayOfWeekSalesApiService } from '@orderna/admin-panel/src/app/services/sales-analytics/day-of-week-sales/day-of-week-sales-api.service';
import { StoresApiService } from '@orderna/admin-panel/src/app/core/stores/stores-api.service';
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
  selector: 'app-day-of-week',
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
  templateUrl: './day-of-week.component.html',
  styleUrl: './day-of-week.component.css',
})
export class DayOfWeekComponent implements OnInit {
  readonly columns: TableColumn<IDayOfWeekSale>[] = [
    { key: 'dayOfWeek', label: 'Day of week', type: 'string' },
    { key: 'orders', label: 'Transactions', type: 'number' },
    { key: 'grossSales', label: 'Gross Sales', type: 'currency' },
  ];

  series = signal<ChartOptions['series']>([
    {
      name: 'Transactions',
      type: 'column',
      data: [],
    },
    {
      name: 'Revenue',
      type: 'line',
      data: [],
    },
  ]);

  xaxis = signal<ChartOptions['xaxis']>({ categories: [] });

  chartOptions = computed<Partial<ChartOptions>>(() => ({
    title: {
      text: 'Sales by day of week',
      align: 'left',
    },
    series: this.series(),
    xaxis: this.xaxis(),
    chart: {
      height: 350,
      type: 'line', // Using line chart type to create a combo chart
      toolbar: CHART_TOOLBAR_OPTIONS,
    },
    stroke: {
      width: [0, 4],
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    yaxis: [
      {
        title: {
          text: 'Transactions',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Revenue',
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== 'undefined') {
            return y.toFixed(0);
          }
          return y;
        },
      },
    },
  }));

  queryOptions!: QueryOptions<IDayOfWeekSale>;
  fallbackQueryOptions: QueryOptions<IDayOfWeekSale> = {
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

  dayOfWeekSalesDataSource = new DayOfWeekSalesDataSource(
    this.dayOfWeekSalesService
  );
  dayOfWeekSales$ =
    this.dayOfWeekSalesDataSource.dayOfWeekSales$.asObservable();
  isLoading$ = this.dayOfWeekSalesDataSource.isLoading$.asObservable();
  dayOfWeekSalesChartData$ =
    this.dayOfWeekSalesDataSource.dayOfWeekSalesChartData$.asObservable();
  TotalDayOfWeekSales$ =
    this.dayOfWeekSalesDataSource.totalDayOfWeekSales$.asObservable();

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

  @ViewChild(TableComponent) table!: TableComponent<IDayOfWeekSale>;

  constructor(
    private dayOfWeekSalesService: DayOfWeekSalesApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.storesDataSource.loadStoreNames();

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

        this.dayOfWeekSalesDataSource.loadDayOfWeekSales(this.queryOptions);
        this.dayOfWeekSalesDataSource.loadDayOfWeekSalesChartData();

        return combineLatest([
          this.isLoading$,
          this.TotalDayOfWeekSales$,
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

    this.dayOfWeekSalesChartData$.subscribe((data) => {
      if (!data || data.length === 0) return;
      this.series.set([
        {
          name: 'Transactions',
          type: 'column',
          data: data.map((d) => d.orders),
        },
        {
          name: 'Revenue',
          type: 'line',
          data: data.map((d) => d.grossSales),
        },
      ]);

      this.xaxis.set({
        categories: data?.reduce((acc: string[], sale) => {
          acc.push(sale.dayOfWeek);
          return acc;
        }, []),
      });
    });
  }

  handleStoreFilter(filter?: IStore['id'][]) {
    this.updateQueryParams({ store: filter });
  }

  handleDateFilter(filter?: string) {
    this.updateQueryParams({ dateFilter: filter });
  }

  handleSort(sort?: QueryOptions<IDayOfWeekSale>['sort']) {
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
