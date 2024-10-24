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
import { ITimeOfDaySale } from '@orderna/admin-panel/src/app/model/time-of-day-sale';
import { StoresDataSource } from '@orderna/admin-panel/src/app/services/data-sources/stores.dataSource';
import { TimeOfDaySalesDataSource } from '@orderna/admin-panel/src/app/services/data-sources/time-of-day-sales.dataSource';
import { StoresApiService } from '@orderna/admin-panel/src/app/core/stores/stores-api.service';
import { TimeOfDaySalesApiService } from '@orderna/admin-panel/src/app/services/sales-analytics/time-of-day-sales/time-of-day-sales-api.service';
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
  selector: 'app-time-of-day',
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
  templateUrl: './time-of-day.component.html',
  styleUrl: './time-of-day.component.css',
})
export class TimeOfDayComponent implements OnInit {
  readonly columns: TableColumn<ITimeOfDaySale>[] = [
    { key: 'timeOfDay', label: 'Time of Day', type: 'string' },
    { key: 'orders', label: 'Transactions', type: 'number' },
    { key: 'grossSales', label: 'Gross Sales', type: 'currency' },
  ];
  chartOptions: Partial<ChartOptions>;

  queryOptions!: QueryOptions<ITimeOfDaySale>;
  fallbackQueryOptions: QueryOptions<ITimeOfDaySale> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'id', direction: 'asc' },
  };

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  initialStoreFilterValue: IStore['id'][] = [];
  initialStartDate: Date = new Date();
  initialEndDate: Date = new Date();

  storesDataSource = new StoresDataSource(this.storesService);
  storeNames$ = this.storesDataSource.storeNames$.asObservable();

  timeOfDaySalesDataSource = new TimeOfDaySalesDataSource(
    this.timeOfDaySalesService
  );
  timeOfDaySales$ =
    this.timeOfDaySalesDataSource.timeOfDaySales$.asObservable();
  isLoading$ = this.timeOfDaySalesDataSource.isLoading$.asObservable();
  totalTimeOfDaySales$ =
    this.timeOfDaySalesDataSource.totalTimeOfDaySales$.asObservable();
  timeOfDayChartData$ = this.timeOfDaySalesDataSource.timeOfDaySalesChartData$;

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

  @ViewChild(TableComponent) table!: TableComponent<ITimeOfDaySale>;

  constructor(
    private timeOfDaySalesService: TimeOfDaySalesApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.chartOptions = {
      title: {
        text: 'Sales by time of day',
        align: 'left',
      },
      series: [
        {
          name: 'Orders',
          data: [],
        },
        {
          name: 'Revenue',
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
    this.timeOfDaySalesDataSource.loadTotalTimeOfDaySales();

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

        this.timeOfDaySalesDataSource.loadTimeOfDaySales(this.queryOptions);
        this.timeOfDaySalesDataSource.loadTimeOfDaySalesChartData();

        return combineLatest([
          this.isLoading$,
          this.totalTimeOfDaySales$,
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

    this.timeOfDayChartData$.subscribe((data) => {
      this.chartOptions.series = [
        {
          name: 'Orders',
          data: data?.map((d) => d.orders) ?? [],
        },
        {
          name: 'Revenue',
          data: data?.map((d) => d.grossSales) ?? [],
        },
      ];

      this.chartOptions.xaxis = {
        categories: data?.reduce((acc: string[], sale) => {
          acc.push(sale.timeOfDay);
          return acc;
        }, []),
      };

      this.chartOptions.tooltip = {
        intersect: false,
        shared: true,
      };
    });
  }

  handleStoreFilter(filter?: IStore['id'][]) {
    this.updateQueryParams({ store: filter });
  }

  handleDateFilter(filter?: string) {
    this.updateQueryParams({ dateFilter: filter });
  }

  handleSort(sort?: QueryOptions<ITimeOfDaySale>['sort']) {
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
