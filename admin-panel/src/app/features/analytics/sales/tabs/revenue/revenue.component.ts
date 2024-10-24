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
import { IRevenue } from '@orderna/admin-panel/src/app/model/revenue';
import { IStore } from '@orderna/admin-panel/src/app/model/store';
import { RevenuesDataSource } from '@orderna/admin-panel/src/app/services/data-sources/revenues.dataSource';
import { StoresDataSource } from '@orderna/admin-panel/src/app/services/data-sources/stores.dataSource';
import { RevenuesApiService } from '@orderna/admin-panel/src/app/services/sales-analytics/revenues/revenues-api.service';
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
import { TableTotal } from '@orderna/admin-panel/src/types/table-total';
import { CHART_TOOLBAR_OPTIONS } from '@orderna/admin-panel/src/utils/chart-options';
import { getRandomNumber } from '@orderna/admin-panel/src/utils/dummy-data';
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
  storeFilterOptions: FilterOptionItem<IStore['id'] | 'all'>[];
}
@Component({
  selector: 'app-revenue',
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
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.css',
})
export class RevenueComponent implements OnInit {
  readonly columns: TableColumn<IRevenue>[] = [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'orders', label: 'Transactions', type: 'number' },
    { key: 'grossSales', label: 'Gross Sales', type: 'currency' },
    { key: 'discounts', label: 'Discounts', type: 'currency' },
  ];
  summaryTotals: TableTotal<IRevenue>[] = [];

  chartOptions: Partial<ChartOptions> = {
    title: {
      text: 'Total sales',
      align: 'left',
    },
    series: [
      {
        name: 'Sales',
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

  queryOptions!: QueryOptions<IRevenue>;
  fallbackQueryOptions: QueryOptions<IRevenue> = {
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

  revenuesDataSource = new RevenuesDataSource(this.revenuesService);
  totalRecords$ = this.revenuesDataSource.totalRevenues$.asObservable();
  isLoading$ = this.revenuesDataSource.isLoading$.asObservable();
  revenue$ = this.revenuesDataSource.revenues$.asObservable();
  salesOverTime$ = this.revenuesDataSource.salesOverTime$.asObservable();
  revenueSummary$ = this.revenuesDataSource.revenueSummary$.asObservable();

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

  @ViewChild(TableComponent) table!: TableComponent<IRevenue>;

  constructor(
    private revenuesService: RevenuesApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.storesDataSource.loadStoreNames();
    this.revenuesDataSource.loadTotalRevenues();
    this.revenuesDataSource.loadRevenueSummary();

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

        this.revenuesDataSource.loadRevenues(this.queryOptions);
        this.revenuesDataSource.loadSalesOverTime();
        this.revenuesDataSource.loadRevenueSummary();

        return combineLatest([
          this.isLoading$,
          this.totalRecords$,
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

    this.salesOverTime$.subscribe((sales) => {
      this.chartOptions.series = [
        {
          name: 'Sales',
          data: sales.map((sale) => sale.grossSales - sale.discounts),
        },
      ];

      this.chartOptions.xaxis = {
        categories: sales.reduce((acc: string[], sale) => {
          const month =
            this.dateAdapter.getMonthNames('short')[
              this.dateAdapter.getMonth(sale.date)
            ];
          acc.push(`${sale.date.getDate()} ${month}`);
          return acc;
        }, []),
      };
    });

    this.revenueSummary$.subscribe((summary) => {
      this.summaryTotals = [
        { field: 'date', isLabel: true, value: 'Summary' },
        { field: 'orders', isLabel: false, value: summary?.orders ?? 0 },
        {
          field: 'grossSales',
          isLabel: false,
          value: summary?.grossSales ?? 0,
        },
        { field: 'discounts', isLabel: false, value: summary?.discounts ?? 0 },
      ];
    });
  }

  handleStoreFilter(filter?: IStore['id'][]) {
    this.updateQueryParams({ store: filter });
  }

  handleDateFilter(filter?: string) {
    this.updateQueryParams({ dateFilter: filter });
  }

  handleSort(sort?: QueryOptions<IRevenue>['sort']) {
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
