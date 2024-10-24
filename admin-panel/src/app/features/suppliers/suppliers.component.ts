import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../shared/components/button/button.component';
import {
  TableComponent,
  TableRowExpandableContentDirective,
} from '../../shared/components/table/table.component';
import { TableSkeletonComponent } from '../../shared/components/table/table-skeleton.component';
import { RowControlComponent } from '../../shared/components/row-controls/row-controls.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { InputSearchComponent } from '../../shared/components/input/search/search.component';
import { InputFilterImmediateComponent } from '../../shared/components/input/filter-immediate/filter-immediate.component';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import { ISupplier, Supplier } from '../../model/supplier';
import {
  DATE_FILTER_OPTIONS,
  PAYMENTTYPE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from '@orderna/admin-panel/src/utils/constants/filter-options';
import {
  ActivatedRoute,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  switchMap,
  of,
  take,
} from 'rxjs';
import { SuppliersDataSource } from '../../services/data-sources/supplies.dataSource';
import {
  DEFAULT_QUERY_OPTIONS,
  QueryOptions,
  toQueryOptions,
} from '@orderna/admin-panel/src/types/query-options';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';

import { MatDialog } from '@angular/material/dialog';
import { SupplierConfirmBulkDeleteModalComponent } from './components/supplier-modals/supplier-confirm-bulk-delete-modal.component';
import { SupplierConfirmDeleteModalComponent } from './components/supplier-modals/supplier-confirm-delete-modal.component';
import { SupplierModalComponent } from './components/supplier-modals/supplier-modal.component';
import { StoresDataSource } from '../../services/data-sources/stores.dataSource';
import { IStore } from '../../model/store';
import {
  FilterOption,
  FilterOptionItem,
} from '@orderna/admin-panel/src/types/filter';
import { InputFilterCheckboxComponent } from '../../shared/components/input/filter-checkbox/filter-checkbox.component';
import { StoresApiService } from '../../core/stores/stores-api.service';
import { SuppliersApiService } from '../../services/suppliers/suppliers-api.service';

interface PageData {
  isLoading: boolean;
  totalSuppliers: number;
  storeFilterOptions: FilterOptionItem<IStore['id'] | 'all'>[];
}

@Component({
  selector: 'app-suppliers',
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
    InputFilterImmediateComponent,
    InputFilterCheckboxComponent,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css',
})
export class SuppliersComponent {
  readonly columns: TableColumn<ISupplier>[] = [
    {
      key: 'id',
      type: 'id',
      label: 'ID',
    },
    {
      key: 'fullName',
      type: 'round-img-plus-string',
      label: 'Name',
    },
    {
      key: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      key: 'address',
      type: 'string',
      label: 'ADDRESS',
    },
    {
      key: 'orders',
      type: 'number',
      label: 'TRANSACTIONS',
    },
    {
      key: 'lastOrder',
      type: 'string',
      label: 'LAST TRANSACTION',
    },
    {
      key: 'toatlSpend',
      type: 'currency',
      label: 'TOTAL SPENT',
    },
    {
      key: 'refunds',
      type: 'number',
      label: 'REFUNDS',
    },
  ];

  readonly dateFilterOptions = DATE_FILTER_OPTIONS;
  // readonly statusFilter= STATUS_FILTER_OPTIONS;

  readonly filterOptions: FilterOption<ISupplier, 'status' | 'paymentType'>[] =
    [
      {
        groupName: 'status',
        options: STATUS_FILTER_OPTIONS,
      },
      {
        groupName: 'paymentType',
        options: PAYMENTTYPE_FILTER_OPTIONS,
      },
    ];
  @ViewChild(TableComponent) table!: TableComponent<Supplier>;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  errorMessage?: string;
  infoMessage?: string;

  selectAll: boolean = false;
  selectedSuppliers: Supplier['id'][] = [];

  dataSource = new SuppliersDataSource(this.suppliersService);
  totalSuppliers$ = this.dataSource.totalSuppliers$.asObservable();
  isLoading$ = this.dataSource.isLoading$.asObservable();

  storesDataSource = new StoresDataSource(this.storesService);
  storeNames$ = this.storesDataSource.storeNames$.asObservable();

  data$!: Observable<PageData>;

  queryOptions!: QueryOptions<ISupplier>;
  fallbackQueryOptions: QueryOptions<ISupplier> = {
    ...DEFAULT_QUERY_OPTIONS,
    // sort: { field: 'createdAt', direction: 'desc' },
  };

  get initialStoreFilterValue() {
    const { filters } = this.queryOptions;
    const storeFilter = filters?.find((filter) => filter.field === 'store');

    return storeFilter ? +storeFilter.value : 'all';
  }
  constructor(
    private suppliersService: SuppliersApiService,
    private storesService: StoresApiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataSource.loadTotalSuppliers();
    this.storesDataSource.loadStoreNames();

    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const optionalParamKeys = ['store', 'paymentType', 'status'];
        const { queryOptions, error } = toQueryOptions(
          params,
          this.fallbackQueryOptions,
          optionalParamKeys
        );

        if (error) throw error;

        this.queryOptions = queryOptions!;
        this.dataSource.loadSuppliers(this.queryOptions);

        return combineLatest([
          this.isLoading$,
          this.totalSuppliers$,
          this.storeNames$,
        ]).pipe(
          map(([isLoading, totalSuppliers, storeNames]) => ({
            isLoading,
            totalSuppliers,
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
            this.errorMessage = 'Error while compiling Supplier data';
            return of({
              isLoading: false,
              totalSuppliers: 0,
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

  getSelectedSuppliersCount(totalSuppliers: number) {
    return this.selectAll
      ? totalSuppliers - this.selectedSuppliers.length
      : this.selectedSuppliers.length;
  }
  handleSearch(searchTerm: string) {
    this.updateQueryParams({ search: searchTerm || undefined });
  }

  handleFilter(
    filters: (string | { groupName: keyof ISupplier; filters: string[] })[]
  ) {
    const params: Params = {};
    for (const filter of filters) {
      if (typeof filter === 'object' && filter !== null) {
        params[filter.groupName] = filter.filters.join(',') || undefined;
      }
    }
    this.updateQueryParams(params);
  }

  handleAllRowsSelectedChange(value: boolean) {
    this.selectAll = value;
  }

  handleRowsSelectedChange(ids: Supplier['id'][]) {
    this.selectedSuppliers = ids;
  }
  handleDateFilter(filter?: string) {
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

  handleSort(sort?: QueryOptions<Supplier>['sort']) {
    if (sort) {
      const { field, direction } = sort;

      this.updateQueryParams({ sort: `${field}_${direction}` });
    } else {
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

  openSupplierModal(supplier?: ISupplier) {
    const dialogRef = this.dialog.open(SupplierModalComponent, {
      id: 'add-supplier-modal',
      data: { supplier },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
  }

  openSupplierConfirmDeleteModal(supplier: ISupplier) {
    const dialogRef = this.dialog.open(SupplierConfirmDeleteModalComponent, {
      id: 'confirm-delete-supplier-modal',
      data: { supplier },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.table.clearRowSelection(supplier.id);
      });
  }

  openSupplierConfirmBulkDeleteModal(suppliersToDeleteCount: number) {
    const dialogRef = this.dialog.open(
      SupplierConfirmBulkDeleteModalComponent,
      {
        id: 'confirm-bulk-delete-supplier-modal',
        data: {
          suppliersToDeleteCount,
          selectAll: this.selectAll,
          selectedSuppliers: this.selectedSuppliers,
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
}
