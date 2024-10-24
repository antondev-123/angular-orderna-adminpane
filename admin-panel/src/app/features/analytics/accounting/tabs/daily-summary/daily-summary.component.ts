import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
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
import { DailySummary } from '@orderna/admin-panel/src/app/model/daily-summary';
import { IStore } from '@orderna/admin-panel/src/app/model/store';
import { DailySummariesApiService } from '@orderna/admin-panel/src/app/services/accounting-analytics/daily-summaries/daily-summaries-api.service';
import { DailySummariesDataSource } from '@orderna/admin-panel/src/app/services/data-sources/daily-summary.dataSource';
import { StoresDataSource } from '@orderna/admin-panel/src/app/services/data-sources/stores.dataSource';
import { StoresApiService } from '@orderna/admin-panel/src/app/core/stores/stores-api.service';
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
  selector: 'app-daily-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    InputFilterImmediateComponent,
    InputDateRangeComponent,

    TableComponent,
    TableSkeletonComponent,
    RowControlComponent,
    PaginationComponent,
  ],
  templateUrl: './daily-summary.component.html',
  styleUrl: './daily-summary.component.css',
})
export class DailySummaryComponent implements OnInit {
  readonly columns: TableColumn<DailySummary>[] = [
    {
      key: 'date',
      type: 'date',
      label: 'Date',
    },
    {
      key: 'transactions',
      type: 'number',
      label: 'Transactions',
    },
    {
      key: 'revenue',
      type: 'currency',
      label: 'Revenue',
    },
    {
      key: 'costOfGoods',
      type: 'currency',
      label: 'Cost of Goods Sold',
    },
    {
      key: 'grossProfit',
      type: 'currency',
      label: 'Gross Profit',
    },
    {
      key: 'fees',
      type: 'currency',
      label: 'Fees',
    },
    {
      key: 'tips',
      type: 'number',
      label: 'Tips',
    },
    {
      key: 'tipsAmount',
      type: 'currency',
      label: 'Tips Amount',
    },
    {
      key: 'refunds',
      type: 'number',
      label: 'Refunds',
    },
    {
      key: 'refundsAmount',
      type: 'currency',
      label: 'Refunds Amount',
    },
  ];

  summaryTotals: TableTotal<DailySummary>[] = [];

  @ViewChild(TableComponent) table!: TableComponent<DailySummary>;

  storesDataSource = new StoresDataSource(this.storesService);
  storeNames$ = this.storesDataSource.storeNames$.asObservable();

  dailySummariesDataSource = new DailySummariesDataSource(
    this.dailySummariesService
  );
  dailySummaries$ =
    this.dailySummariesDataSource.dailySummaries$.asObservable();
  totalDailySummaries$ =
    this.dailySummariesDataSource.totalDailySummaries$.asObservable();
  dailySummariesIsLoading$ =
    this.dailySummariesDataSource.isLoading$.asObservable();
  computedDailySummaries$ =
    this.dailySummariesDataSource.computedDailySummaries$.asObservable();

  data$!: Observable<PageData>;
  queryOptions!: QueryOptions<DailySummary>;
  fallbackQueryOptions: QueryOptions<DailySummary> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'id', direction: 'desc' },
  };

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  initialStoreFilterValue: IStore['id'][] = [];
  initialStartDate: Date = new Date();
  initialEndDate: Date = new Date();

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
  infoMessage?: string;

  constructor(
    private dailySummariesService: DailySummariesApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.storesDataSource.loadStoreNames();
    this.dailySummariesDataSource.loadTotalDailySummaries();
    this.dailySummariesDataSource.loadComputedDailySummaries();

    this.computedDailySummaries$.subscribe((data) => {
      this.summaryTotals = [
        { field: 'date', value: 'Summary', isLabel: true },
        {
          field: 'transactions',
          value: data?.transactions ?? 0,
          isLabel: false,
        },
        {
          field: 'costOfGoods',
          value: data?.costOfGoods ?? 0,
          isLabel: false,
        },
        {
          field: 'grossProfit',
          value: data?.grossProfit ?? 0,
          isLabel: false,
        },
        { field: 'revenue', value: data?.revenue ?? 0, isLabel: false },
        { field: 'fees', value: data?.fees ?? 0, isLabel: false },
        { field: 'tips', value: data?.tips ?? 0, isLabel: false },
        { field: 'tipsAmount', value: data?.tipsAmount ?? 0, isLabel: false },
        { field: 'refunds', value: data?.refunds ?? 0, isLabel: false },
        {
          field: 'refundsAmount',
          value: data?.refundsAmount ?? 0,
          isLabel: false,
        },
      ];
    });

    this.data$ = this.route.queryParams.pipe(
      switchMap((rawParams: Params) => {
        // Ignore 'status' queryParam.
        // Can be in the queryParams because other tabs (e.g. All Transaction) use it.
        // But 'Daily Transaction' doesn't need it.
        const params = { ...rawParams };
        delete params['status'];

        const optionalParamKeys = ['store'];
        const { queryOptions, error } = toQueryOptions(
          params,
          this.fallbackQueryOptions,
          optionalParamKeys
        );

        if (error) throw error;

        const dateFilter = queryOptions?.dateFilter;
        if (dateFilter) {
          const [start, end] = dateFilter.split('_');
          this.initialStartDate = new Date(start);
          this.initialEndDate = new Date(end);
        }

        this.queryOptions = queryOptions!;

        this.dailySummariesDataSource.loadDailySummaries(this.queryOptions);

        return combineLatest([
          this.dailySummariesIsLoading$,
          this.totalDailySummaries$,
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
        this.errorMessage = error.message;
        this.cdr.detectChanges();
        return of();
      })
    );
  }

  handleStoreFilter(filter?: IStore['id'][]) {
    this.updateQueryParams({ store: filter });
  }

  handleDateFilter(filter?: string) {
    this.updateQueryParams({ dateFilter: filter });
  }

  handleSort(sort?: QueryOptions<DailySummary>['sort']) {
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
    console.log('from', this.route.snapshot.queryParams, 'to', updatedParams);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedParams,
      queryParamsHandling: handling,
      replaceUrl: false, // adds new history to URL
    });
  }
}
