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
import { TransactionStatus } from '@orderna/admin-panel/src/app/model/enum/transaction-status';
import { IStore } from '@orderna/admin-panel/src/app/model/store';
import { ITransaction } from '@orderna/admin-panel/src/app/model/transaction';
import { AllTransactionsApiService } from '@orderna/admin-panel/src/app/services/accounting-analytics/all-transactions/all-transactions-api.service';
import { AllTransactionsDataSource } from '@orderna/admin-panel/src/app/services/data-sources/all-transactions.dataSource';
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
import { TRANSACTION_STATUS_FILTER_OPTIONS } from '@orderna/admin-panel/src/utils/constants/filter-options';
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
  selector: 'app-all-transactions',
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
  templateUrl: './all-transactions.component.html',
  styleUrl: './all-transactions.component.css',
})
export class AllTransactionsComponent implements OnInit {
  readonly columns: TableColumn<ITransaction>[] = [
    {
      key: 'transactionDate',
      type: 'date',
      label: 'Date',
    },
    {
      key: 'paymentType',
      type: 'string',
      label: 'Payment',
      getValue: (v) =>
        v.paymentType
          .split('_')
          .map(
            (s) => s.charAt(0).toLocaleUpperCase() + s.slice(1).toLowerCase()
          )
          .join(' '),
    },
    {
      key: 'status',
      type: 'badge',
      label: 'Status',
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
      key: 'grossAmount',
      type: 'currency',
      label: 'Gross Amount',
    },
    {
      key: 'service',
      type: 'currency',
      label: 'Service Fee',
    },
    {
      key: 'tip',
      type: 'currency',
      label: 'Tip',
    },
    {
      key: 'tax',
      type: 'currency',
      label: 'Tax',
    },
    {
      key: 'refund',
      type: 'currency',
      label: 'Refund',
    },
  ];

  readonly statusFilterOptions: FilterOptionItem<TransactionStatus | 'all'>[] =
    [{ label: 'All', value: 'all' }, ...TRANSACTION_STATUS_FILTER_OPTIONS];

  @ViewChild(TableComponent) table!: TableComponent<ITransaction>;

  storesDataSource = new StoresDataSource(this.storesService);

  storeNames$ = this.storesDataSource.storeNames$.asObservable();

  allTransactionDataSource = new AllTransactionsDataSource(
    this.allTransactionsService
  );
  allTransactions$ =
    this.allTransactionDataSource.allTransactions$.asObservable();
  totalAllTransactions$ =
    this.allTransactionDataSource.totalAllTransactions$.asObservable();
  isLoading$ = this.allTransactionDataSource.isLoading$.asObservable();

  data$!: Observable<PageData>;
  queryOptions!: QueryOptions<ITransaction>;
  fallbackQueryOptions: QueryOptions<ITransaction> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'id', direction: 'desc' },
  };

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  initialStoreFilterValue: IStore['id'][] = [];
  initialStartDate: Date = new Date();
  initialEndDate: Date = new Date();
  initialStatusFilterValue: TransactionStatus | 'all' = 'all';

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

  constructor(
    private allTransactionsService: AllTransactionsApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.storesDataSource.loadStoreNames();
    this.allTransactionDataSource.loadTotalAllTransactions();

    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const optionalParamKeys = ['store', 'status'];
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

        this.allTransactionDataSource.loadTransactions(this.queryOptions);

        return combineLatest([
          this.isLoading$,
          this.totalAllTransactions$,
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

  handleStatusFilter(filter?: string) {
    this.updateQueryParams({ status: filter });
  }

  handleSort(sort?: QueryOptions<ITransaction>['sort']) {
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
