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
import { IZReport } from '@orderna/admin-panel/src/app/model/z-report';
import { StoresDataSource } from '@orderna/admin-panel/src/app/services/data-sources/stores.dataSource';
import { ZReportsDataSource } from '@orderna/admin-panel/src/app/services/data-sources/z-reports.dataSource';
import { StoresApiService } from '@orderna/admin-panel/src/app/core/stores/stores-api.service';
import { ZReportsApiService } from '@orderna/admin-panel/src/app/services/sales-analytics/z-reports/z-reports-api.service';
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
  selector: 'app-z-report',
  standalone: true,
  imports: [
    CommonModule,

    InputFilterImmediateComponent,
    InputDateRangeComponent,

    TableComponent,
    TableSkeletonComponent,
    RowControlComponent,
    PaginationComponent,
  ],
  templateUrl: './z-report.component.html',
  styleUrl: './z-report.component.css',
})
export class ZReportComponent implements OnInit {
  readonly columns: TableColumn<IZReport>[] = [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'totalTransactions', label: 'Total Transactions', type: 'number' },
    { key: 'grossRevenues', label: 'Gross Revenue', type: 'currency' },
    { key: 'cardPayments', label: 'Card Payments', type: 'currency' },
    { key: 'cashPayments', label: 'Cash Payments', type: 'currency' },
    { key: 'tips', label: 'Tips', type: 'currency' },
    { key: 'serviceCharges', label: 'Service Charges', type: 'currency' },
    { key: 'averageValue', label: 'Average Value', type: 'currency' },
    { key: 'discounts', label: 'Discounts', type: 'currency' },
    {
      key: 'quantityOfRefunds',
      label: 'Quantity of Refunds',
      type: 'number',
    },
    { key: 'totalRefunds', label: 'Total Refunds', type: 'currency' },
  ];
  summaryTotals: TableTotal<IZReport>[] = [];

  queryOptions!: QueryOptions<IZReport>;
  fallbackQueryOptions: QueryOptions<IZReport> = {
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

  zReportsDataSource = new ZReportsDataSource(this.zReportsService);
  isLoading$ = this.zReportsDataSource.isLoading$.asObservable();
  zReports$ = this.zReportsDataSource.zReports$.asObservable();
  totalZReports$ = this.zReportsDataSource.totalZReports$.asObservable();
  zReportSummary$ = this.zReportsDataSource.zReportSummary$.asObservable();

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

  @ViewChild(TableComponent) table!: TableComponent<IZReport>;

  constructor(
    private zReportsService: ZReportsApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.storesDataSource.loadStoreNames();
    this.zReportsDataSource.loadTotalZReports();

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

        if (error) throw error;

        this.queryOptions = queryOptions!;
        this.zReportsDataSource.loadZReports(this.queryOptions);
        this.zReportsDataSource.loadZReportSummary();

        return combineLatest([
          this.isLoading$,
          this.totalZReports$,
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

    this.zReportSummary$.subscribe((summary) => {
      this.summaryTotals = [
        { field: 'date', isLabel: true, value: 'Summary' },
        {
          field: 'totalTransactions',
          isLabel: false,
          value: summary?.totalTransactions ?? 0,
        },
        {
          field: 'grossRevenues',
          isLabel: false,
          value: summary?.grossRevenues ?? 0,
        },
        {
          field: 'cardPayments',
          isLabel: false,
          value: summary?.cardPayments ?? 0,
        },
        {
          field: 'cashPayments',
          isLabel: false,
          value: summary?.cashPayments ?? 0,
        },
        { field: 'tips', isLabel: false, value: summary?.tips ?? 0 },
        {
          field: 'serviceCharges',
          isLabel: false,
          value: summary?.serviceCharges ?? 0,
        },
        {
          field: 'averageValue',
          isLabel: false,
          value: summary?.averageValue ?? 0,
        },
        { field: 'discounts', isLabel: false, value: summary?.discounts ?? 0 },
        {
          field: 'quantityOfRefunds',
          isLabel: false,
          value: summary?.quantityOfRefunds ?? 0,
        },
        {
          field: 'totalRefunds',
          isLabel: false,
          value: summary?.totalRefunds ?? 0,
        },
      ];
    });
  }

  handleStoreFilter(filter?: IStore['id'][]) {
    this.updateQueryParams({ store: filter });
  }

  handleDateFilter(filter?: string) {
    this.updateQueryParams({ dateFilter: filter });
  }

  handleSort(sort?: QueryOptions<IZReport>['sort']) {
    if (sort) {
      const { field, direction } = sort;
      console.log(`Sorting ${field} in ${direction} ending order`);
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
