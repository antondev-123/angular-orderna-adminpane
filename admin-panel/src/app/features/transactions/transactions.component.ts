import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FilterOption,
  FilterOptionItem,
} from '@orderna/admin-panel/src/types/filter';
import { ITransaction, Transaction } from '../../model/transaction';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../shared/components/button/button.component';
import { InputFilterCheckboxComponent } from '../../shared/components/input/filter-checkbox/filter-checkbox.component';
import { InputFilterImmediateComponent } from '../../shared/components/input/filter-immediate/filter-immediate.component';
import { InputSearchComponent } from '../../shared/components/input/search/search.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { RowControlComponent } from '../../shared/components/row-controls/row-controls.component';
import { TableSkeletonComponent } from '../../shared/components/table/table-skeleton.component';
import {
  TableComponent,
  TableRowExpandableContentDirective,
} from '../../shared/components/table/table.component';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import {
  DATE_FILTER_OPTIONS,
  PAYMENT_FILTER_OPTIONS,
  TRANSACTION_STATUS_FILTER_OPTIONS,
} from '@orderna/admin-panel/src/utils/constants/filter-options';
import {
  ActivatedRoute,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import { TransactionsDataSource } from '../../services/data-sources/transactions.dataSource';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';
import {
  DEFAULT_QUERY_OPTIONS,
  QueryOptions,
  toQueryOptions,
} from '@orderna/admin-panel/src/types/query-options';
import { StoresDataSource } from '../../services/data-sources/stores.dataSource';
import { IStore } from '../../model/store';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { StoresApiService } from '../../core/stores/stores-api.service';
import { TransactionsApiService } from '../../services/transactions/transactions-api.service';
import { TransactionModalComponent } from './components/transaction-modals/transaction-modal.component';
import { TransactionConfirmDeleteModalComponent } from './components/transaction-modals/transaction-confirm-delete-modal.component';
import { TransactionConfirmBulkDeleteModalComponent } from './components/transaction-modals/transaction-confirm-bulk-delete-modal.component';

interface PageData {
  isLoading: boolean;
  totalTransactions: number;
  storeFilterOptions: FilterOptionItem<IStore['id'] | 'all'>[];
}
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,

    ButtonComponent,
    ButtonTextDirective,

    TableComponent,
    TableRowExpandableContentDirective,
    TableSkeletonComponent,
    RowControlComponent,
    PaginationComponent,

    InputSearchComponent,
    InputFilterCheckboxComponent,
    InputFilterImmediateComponent,

    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  readonly columns: TableColumn<ITransaction>[] = [
    {
      key: 'id',
      type: 'id',
      label: 'Transaction',
    },
    {
      key: 'transactionDate',
      type: 'date',
      label: 'Date',
    },
    {
      key: 'customer',
      type: 'round-img-plus-string',
      label: 'Customer',
      getValue: (v) => v.customer?.fullName ?? 'Walk In',
    },
    {
      key: 'grossSales',
      type: 'currency',
      label: 'Total',
    },
    {
      key: 'status',
      type: 'badge',
      label: 'Status',
    },
    {
      key: 'itemCount',
      type: 'string',
      label: 'Items',
    },
    {
      key: 'store',
      type: 'string',
      label: 'Store',
      getValue: (v) => v.store.name,
    },
    {
      key: 'paymentType',
      type: 'string',
      label: 'Payment Type',
      getValue: (v) =>
        v.paymentType
          .split('_')
          .map(
            (s) => s.charAt(0).toLocaleUpperCase() + s.slice(1).toLowerCase()
          )
          .join(' '),
    },
  ];

  readonly dateFilterOptions = DATE_FILTER_OPTIONS;

  readonly filterOptions: FilterOption<
    ITransaction,
    'status' | 'paymentType'
  >[] = [
    {
      groupName: 'status',
      options: TRANSACTION_STATUS_FILTER_OPTIONS,
    },
    {
      groupName: 'paymentType',
      options: PAYMENT_FILTER_OPTIONS,
    },
  ];

  @ViewChild(TableComponent) table!: TableComponent<Transaction>;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  errorMessage?: string;
  infoMessage?: string;

  selectAll: boolean = false;
  selectedTransactions: Transaction['id'][] = [];

  showTransactionModal: boolean = false;

  transactionsDataSource = new TransactionsDataSource(this.transactionsService);
  totalTransactions$ =
    this.transactionsDataSource.totalTransactionsAfterFilter$.asObservable();
  isLoading$ = this.transactionsDataSource.isLoading$.asObservable();

  storesDataSource = new StoresDataSource(this.storesService);
  storeNames$ = this.storesDataSource.storeNames$.asObservable();

  data$!: Observable<PageData>;

  queryOptions!: QueryOptions<ITransaction>;
  fallbackQueryOptions: QueryOptions<ITransaction> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'createdAt', direction: 'desc' },
  };

  get showRowControls() {
    return this.selectAll || this.selectedTransactions;
  }

  get initialStoreFilterValue() {
    const { filters } = this.queryOptions;
    const storeFilter = filters?.find((filter) => filter.field === 'store');

    return storeFilter ? +storeFilter.value : 'all';
  }

  constructor(
    private storesService: StoresApiService,
    private transactionsService: TransactionsApiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.storesDataSource.loadStoreNames();

    // TODO: Delete. Temporary code to view styles immediately
    // this.openTransactionModal();

    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const optionalParamKeys = ['store', 'status', 'paymentType'];
        const { queryOptions, error } = toQueryOptions(
          params,
          this.fallbackQueryOptions,
          optionalParamKeys
        );

        if (error) throw error;

        this.queryOptions = queryOptions!;
        this.transactionsDataSource.loadTransactions(this.queryOptions);

        return combineLatest([
          this.isLoading$,
          this.totalTransactions$,
          this.storeNames$,
        ]).pipe(
          map(([isLoading, totalTransactions, storeNames]) => ({
            isLoading,
            totalTransactions,
            storeFilterOptions: [
              {
                value: 'all' as 'all',
                label: 'All Stores',
              },
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
              totalTransactions: 0,
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

  getSelectedTransactionsCount(totalTransactions: number) {
    return this.selectAll
      ? totalTransactions - this.selectedTransactions.length
      : this.selectedTransactions.length;
  }

  handleSearch(searchTerm: string) {
    console.log(`Searching for ${searchTerm}`);
    this.updateQueryParams({ search: searchTerm || undefined });
  }

  handleFilter(
    filters: (string | { groupName: keyof ITransaction; filters: string[] })[]
  ) {
    console.log(`Applying filters:`);
    console.log(filters);

    const params: Params = {};
    for (const filter of filters) {
      if (typeof filter === 'object' && filter !== null) {
        params[filter.groupName] = filter.filters.join(',') || undefined;
      }
    }
    this.updateQueryParams(params);
  }

  handleDateFilter(filter?: string) {
    console.log(`Applying date filter: ${filter}`);
    this.updateQueryParams({ dateFilter: filter || undefined });
  }

  handleStoreFilter(filter?: IStore['id'] | 'all') {
    console.log(`Applying store filter: ${filter}`);
    if (filter === 'all') {
      this.updateQueryParams({ store: undefined });
    } else {
      this.updateQueryParams({ store: filter || undefined });
    }
  }

  handleAllRowsSelectedChange(value: boolean) {
    this.selectAll = value;
  }

  handleRowsSelectedChange(ids: Transaction['id'][]) {
    this.selectedTransactions = ids;
  }

  handleSort(sort?: QueryOptions<Transaction>['sort']) {
    if (sort) {
      const { field, direction } = sort;
      console.log(`Sorting ${field} in ${direction}ending order`);
      this.updateQueryParams({ sort: `${field}_${direction}` });
    } else {
      console.log(`Sorting cleared`);
      this.updateQueryParams({ sort: undefined });
    }
  }

  openTransactionModal(transaction?: ITransaction) {
    const dialogRef = this.dialog.open(TransactionModalComponent, {
      id: 'add-transaction-modal',
      data: { transaction },
      // Note: Material dialog components are globally configured (see app.config.ts) to take up a maximum of 512px horizontally,
      //       but this modal have inputs (particularly product inputs) that would benefit from some extra space
      //       that's why it overrides the dialog width below to take up 600px.
      maxWidth: 600,
      minWidth: 600,
      minHeight: 740,
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
  }

  openTransactionConfirmDeleteModal(transaction: ITransaction) {
    const dialogRef = this.dialog.open(TransactionConfirmDeleteModalComponent, {
      id: 'confirm-delete-transaction-modal',
      data: { transaction },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.table.clearRowSelection(transaction.id);
      });
  }

  openTransactionConfirmBulkDeleteModal(transationsToDeleteCount: number) {
    const dialogRef = this.dialog.open(
      TransactionConfirmBulkDeleteModalComponent,
      {
        id: 'confirm-bulk-delete-transaction-modal',
        data: {
          transationsToDeleteCount,
          selectAll: this.selectAll,
          selectedTransactions: this.selectedTransactions,
        },
      }
    );
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.table.clearRowSelection();
      });
  }

  goToTransactionPage(transaction: ITransaction) {
    this.router.navigate(['transactions', transaction.id], {
      queryParamsHandling: 'merge',
    });
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
