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
import { ISaleDiscountSummary } from '@orderna/admin-panel/src/app/model/discount-summary';
import { IStore } from '@orderna/admin-panel/src/app/model/store';
import { DiscountSummariesDataSource } from '@orderna/admin-panel/src/app/services/data-sources/discount-summaries.dataSource';
import { StoresDataSource } from '@orderna/admin-panel/src/app/services/data-sources/stores.dataSource';
import { DiscountSummariesApiService } from '@orderna/admin-panel/src/app/services/sales-analytics/discount-summaries/discount-summaries-api.service';
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
  selector: 'app-discount-summaries',
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
  templateUrl: './discount-summaries.component.html',
  styleUrl: './discount-summaries.component.css',
})
export class DiscountSummariesComponent implements OnInit {
  readonly columns: TableColumn<ISaleDiscountSummary>[] = [
    {
      key: 'discount',
      label: 'Discount Code',
      type: 'string',
      getValue: (v) => v.discount.code,
    },
    { key: 'usageCount', label: 'Usage Count', type: 'number' },
    { key: 'totalRedeemed', label: 'Total Redeemed', type: 'currency' },
    {
      key: 'averageOrderValue',
      label: 'Average Transaction Value',
      type: 'currency',
    },
  ];
  chartOptions: Partial<ChartOptions>;

  queryOptions!: QueryOptions<ISaleDiscountSummary>;
  fallbackQueryOptions: QueryOptions<ISaleDiscountSummary> = {
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

  discountSummariesDataSource = new DiscountSummariesDataSource(
    this.discountSummariesService
  );
  discountSummaries$ =
    this.discountSummariesDataSource.discountSummaries$.asObservable();
  isLoading$ = this.discountSummariesDataSource.isLoading$.asObservable();
  totalDiscountSummaries$ =
    this.discountSummariesDataSource.totalDiscountSummaries$.asObservable();
  discountSummaryChartData$ =
    this.discountSummariesDataSource.discountSummaryChartData$.asObservable();

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

  @ViewChild(TableComponent) table!: TableComponent<ISaleDiscountSummary>;

  constructor(
    private discountSummariesService: DiscountSummariesApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.chartOptions = {
      title: {
        text: 'Discount summaries',
        align: 'left',
      },
      series: [
        {
          name: 'Discount summaries',
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
    this.discountSummariesDataSource.loadTotalDiscountSummaries();

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

        this.discountSummariesDataSource.loadDiscountSummaries(
          this.queryOptions
        );
        this.discountSummariesDataSource.loadDiscountSummaryChartData();

        return combineLatest([
          this.isLoading$,
          this.totalDiscountSummaries$,
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

    this.discountSummaryChartData$.subscribe((data) => {
      this.chartOptions.series = [
        {
          name: 'Discount summaries',
          data: data?.map((d) => d.averageOrderValue) ?? [],
        },
      ];

      this.chartOptions.xaxis = {
        categories: data?.reduce((acc: string[], sale) => {
          acc.push(sale.discount.code);
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

  handleSort(sort?: QueryOptions<ISaleDiscountSummary>['sort']) {
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
