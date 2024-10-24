import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICustomer, Customer } from '../../model/customer';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import {
  ActivatedRoute,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import {
  TableComponent,
  TableRowExpandableContentDirective,
} from '../../shared/components/table/table.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../shared/components/button/button.component';
import { InputSearchComponent } from '../../shared/components/input/search/search.component';
import { InputFilterCheckboxComponent } from '../../shared/components/input/filter-checkbox/filter-checkbox.component';
import { InputFilterImmediateComponent } from '../../shared/components/input/filter-immediate/filter-immediate.component';
import { RowControlComponent } from '../../shared/components/row-controls/row-controls.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { formatPhilippinePhoneNumber } from '@orderna/admin-panel/src/utils/format';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { TableSkeletonComponent } from '../../shared/components/table/table-skeleton.component';
import { DATE_FILTER_OPTIONS } from '@orderna/admin-panel/src/utils/constants/filter-options';
import { CustomersDataSource } from '../../services/data-sources/customers.dataSource';
import { CustomerConfirmBulkDeleteModalComponent } from './components/customer-modals/customer-confirm-bulk-delete-modal.component';
import { CustomerConfirmDeleteModalComponent } from './components/customer-modals/customer-confirm-delete-modal.component';
import { CustomerModalComponent } from './components/customer-modals/customer-modal.component';
import { FilterOptionItem } from '@orderna/admin-panel/src/types/filter';
import { IStore } from '../../model/store';
import { StoresDataSource } from '../../services/data-sources/stores.dataSource';
import { CustomersApiService } from '../../services/customers/customers-api.service';
import { StoresApiService } from '../../core/stores/stores-api.service';

interface PageData {
  isLoading: boolean;
  totalCustomers: number;
  storeFilterOptions: FilterOptionItem<IStore['id'] | 'all'>[];
}

@Component({
  selector: 'app-customers',
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
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
  providers: [CurrencyPipe],
})
export class CustomersComponent implements OnInit {
  readonly columns: TableColumn<ICustomer>[] = [
    {
      key: 'id',
      type: 'id',
      label: 'Customer ID',
    },
    {
      key: 'createdAt',
      type: 'date',
      label: 'Created',
    },
    {
      key: 'fullName',
      type: 'round-img-plus-string',
      label: 'Full Name',
    },
    {
      key: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      key: 'mobileNumber',
      type: 'string',
      label: 'Mobile Number',
      getValue: (v) => formatPhilippinePhoneNumber(v.mobileNumber),
    },
    {
      key: 'transactions',
      type: 'string',
      label: 'Transactions',
      getValue: (v) => v.totalTransactions,
    },
    {
      key: 'last-transaction',
      type: 'string',
      label: 'Last Transaction',
      getValue: (v) => (v.lastTransactionId ? `#${v.lastTransactionId}` : null),
      isCopyable: true,
    },
    {
      key: 'total-spent',
      type: 'string',
      label: 'Total Spent',
      getValue: (v) => {
        if (v.totalAmountSpent && v.currencyCode) {
          return this.currencyPipe.transform(
            v.totalAmountSpent,
            v.currencyCode,
            'symbol',
            '1.2-2'
          );
        }
        return '';
      },
    },
    {
      key: 'refunds',
      type: 'string',
      label: 'Refunds',
      getValue: (v) => v.totalRefunds,
    },
  ];

  readonly dateFilterOptions = DATE_FILTER_OPTIONS;

  @ViewChild(TableComponent) table!: TableComponent<Customer>;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  errorMessage?: string;
  infoMessage?: string;

  selectAll: boolean = false;
  selectedCustomers: Customer['id'][] = [];

  showCustomerModal: boolean = false;

  customersDataSource = new CustomersDataSource(this.customersService);
  totalCustomers$ = this.customersDataSource.totalCustomers$.asObservable();
  isLoading$ = this.customersDataSource.isLoading$.asObservable();

  storesDataSource = new StoresDataSource(this.storesService);
  storeNames$ = this.storesDataSource.storeNames$.asObservable();

  data$!: Observable<PageData>;

  queryOptions!: QueryOptions<ICustomer>;
  fallbackQueryOptions: QueryOptions<ICustomer> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'createdAt', direction: 'desc' },
  };

  get showRowControls() {
    return this.selectAll || this.selectedCustomers.length > 0;
  }

  get initialStoreFilterValue() {
    const { filters } = this.queryOptions;
    const storeFilter = filters?.find((filter) => filter.field === 'store');

    return storeFilter ? +storeFilter.value : 'all';
  }

  constructor(
    private customersService: CustomersApiService,
    private storesService: StoresApiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.customersDataSource.loadTotalCustomers();
    this.storesDataSource.loadStoreNames();

    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const optionalParamKeys = ['store'];
        const { queryOptions, error } = toQueryOptions(
          params,
          this.fallbackQueryOptions,
          optionalParamKeys
        );

        if (error) throw error;

        this.queryOptions = queryOptions!;
        this.customersDataSource.loadCustomers(this.queryOptions);

        return combineLatest([
          this.isLoading$,
          this.totalCustomers$,
          this.storeNames$,
        ]).pipe(
          map(([isLoading, totalCustomers, storeNames]) => ({
            isLoading,
            totalCustomers,
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
            this.errorMessage = 'Error while compiling customer data';
            return of({
              isLoading: false, // Default fallback values
              totalCustomers: 0,
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

  getSelectedCustomersCount(totalCustomers: number) {
    return this.selectAll
      ? totalCustomers - this.selectedCustomers.length
      : this.selectedCustomers.length;
  }

  handleSearch(searchTerm: string) {
    console.log(`Searching for ${searchTerm}`);
    this.updateQueryParams({ search: searchTerm || undefined });
  }

  handleFilter(
    filters: (string | { groupName: keyof ICustomer; filters: string[] })[]
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

  handleRowsSelectedChange(ids: Customer['id'][]) {
    this.selectedCustomers = ids;
  }

  handleSort(sort?: QueryOptions<Customer>['sort']) {
    if (sort) {
      const { field, direction } = sort;
      console.log(`Sorting ${field} in ${direction}ending order`);
      this.updateQueryParams({ sort: `${field}_${direction}` });
    } else {
      console.log(`Sorting cleared`);
      this.updateQueryParams({ sort: undefined });
    }
  }

  openCustomerModal(customer?: ICustomer) {
    const dialogRef = this.dialog.open(CustomerModalComponent, {
      id: 'add-customer-modal',
      data: { customer },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
  }

  openCustomerConfirmDeleteModal(customer: ICustomer) {
    const dialogRef = this.dialog.open(CustomerConfirmDeleteModalComponent, {
      id: 'confirm-delete-customer-modal',
      data: { customer },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.table.clearRowSelection(customer.id);
      });
  }

  openCustomerConfirmBulkDeleteModal(customersToDeleteCount: number) {
    const dialogRef = this.dialog.open(
      CustomerConfirmBulkDeleteModalComponent,
      {
        id: 'confirm-bulk-delete-customer-modal',
        data: {
          customersToDeleteCount,
          selectAll: this.selectAll,
          selectedCustomers: this.selectedCustomers,
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

  goToCustomerPage(customer: ICustomer) {
    this.router.navigate(['customers', customer.id], {
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
