import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import { DATE_FILTER_OPTIONS } from '@orderna/admin-panel/src/utils/constants/filter-options';
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
import {
  DEFAULT_QUERY_OPTIONS,
  QueryOptions,
  toQueryOptions,
} from '@orderna/admin-panel/src/types/query-options';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';

import { MatDialog } from '@angular/material/dialog';

import { FilterOptionItem } from '@orderna/admin-panel/src/types/filter';
import { IStore } from '../../../model/store';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../shared/components/button/button.component';
import {
  TableComponent,
  TableRowExpandableContentDirective,
} from '../../../shared/components/table/table.component';
import { TableSkeletonComponent } from '../../../shared/components/table/table-skeleton.component';
import { RowControlComponent } from '../../../shared/components/row-controls/row-controls.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { InputSearchComponent } from '../../../shared/components/input/search/search.component';
import { InputFilterImmediateComponent } from '../../../shared/components/input/filter-immediate/filter-immediate.component';
import { InputFilterCheckboxComponent } from '../../../shared/components/input/filter-checkbox/filter-checkbox.component';

import { StoresDataSource } from '../../../services/data-sources/stores.dataSource';

import { PurchaseModalComponent } from './components/purchase-modals/purchase-modal.component';
import { PurchaseConfirmDeleteModalComponent } from './components/purchase-modals/purchase-confirm-delete-modal.component';
import { PurchaseConfirmBulkDeleteModalComponent } from './components/purchase-modals/purchase-confirm-bulk-delete-modal.component';
import { IPurchase, Purchase } from '../../../model/purchase';
import { PurchaseDataSource } from '../../../services/data-sources/purchase.dataSource';
import { StoresApiService } from '../../../core/stores/stores-api.service';
import { PurchasesApiService } from '../../../services/purchases/purchases-api.service';

interface PageData {
  isLoading: boolean;
  totalPurchases: number;
  storeFilterOptions: FilterOptionItem<IStore['id'] | 'all'>[];
}

@Component({
  selector: 'app-purchases',
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
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css',
  providers: [CurrencyPipe],
})
export class PurchasesComponent implements OnInit {
  readonly columns: TableColumn<IPurchase>[] = [
    {
      key: 'inventoryItem',
      type: 'string',
      label: 'Item',
      getValue: (v) => v.inventoryItemId.title,
    },
    {
      key: 'store',
      type: 'string',
      label: 'store',
      getValue: (v) => v.storeId.name,
    },
    {
      key: 'purchaseDates',
      type: 'date',
      label: 'Purchase Date',
    },
    {
      key: 'unitPrice',
      type: 'currency',
      label: 'Unit Price',
    },
    {
      key: 'quantity',
      type: 'number',
      label: 'Quantity',
      getValue: (v) => {
        return v.quantity + '(' + v.unit + ')';
      },
    },
    {
      key: 'totalPrice',
      type: 'currency',
      label: 'Total Price',
    },
    {
      key: 'supplier',
      type: 'number',
      label: 'Supplier',
      getValue: (v) => v.supplierId.firstName,
    },
    {
      key: 'expirationDate',
      type: 'date',
      label: 'Expiration Date',
    },
  ];

  readonly dateFilterOptions = DATE_FILTER_OPTIONS;
  @ViewChild(TableComponent) table!: TableComponent<Purchase>;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  errorMessage?: string;
  infoMessage?: string;

  selectAll: boolean = false;
  selectedPurchases: Purchase['id'][] = [];

  dataSource = new PurchaseDataSource(this.purchasesService);
  totalPurchases$ = this.dataSource.totalPurchases$.asObservable();
  isLoading$ = this.dataSource.isLoading$.asObservable();

  storesDataSource = new StoresDataSource(this.storesService);
  storeNames$ = this.storesDataSource.storeNames$.asObservable();

  data$!: Observable<PageData>;

  queryOptions!: QueryOptions<IPurchase>;
  fallbackQueryOptions: QueryOptions<IPurchase> = {
    ...DEFAULT_QUERY_OPTIONS,
    // sort: { field: 'createdAt', direction: 'desc' },
  };

  get initialStoreFilterValue() {
    const { filters } = this.queryOptions;
    const storeFilter = filters?.find((filter) => filter.field === 'store');

    return storeFilter ? +storeFilter.value : 'all';
  }
  constructor(
    private purchasesService: PurchasesApiService,
    private storesService: StoresApiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.dataSource.loadTotalPurchase();
    this.storesDataSource.loadStoreNames();

    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const optionalParamKeys = ['store', 'title'];
        const { queryOptions, error } = toQueryOptions(
          params,
          this.fallbackQueryOptions,
          optionalParamKeys
        );

        if (error) throw error;

        this.queryOptions = queryOptions!;
        this.queryOptions.searchFilters = [
          { field: 'inventoryItem', value: 'title' },
          { field: 'store', value: 'name' },
          { field: 'supplier', value: 'firstName' },
        ];
        this.dataSource.loadPurchase(this.queryOptions);

        return combineLatest([
          this.isLoading$,
          this.totalPurchases$,
          this.storeNames$,
        ]).pipe(
          map(([isLoading, totalPurchases, storeNames]) => ({
            isLoading,
            totalPurchases,
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
            this.errorMessage = 'Error while compiling purchase data';
            return of({
              isLoading: false,
              totalPurchases: 0,
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

  getSelectedPurchaseCount(totalPurchaseItem: number) {
    return this.selectAll
      ? totalPurchaseItem - this.selectedPurchases.length
      : this.selectedPurchases.length;
  }
  handleSearch(searchTerm: string) {
    this.updateQueryParams({ search: searchTerm || undefined });
  }

  handleFilter(
    filters: (string | { groupName: keyof IPurchase; filters: string[] })[]
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

  handleRowsSelectedChange(ids: Purchase['id'][]) {
    this.selectedPurchases = ids;
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

  handleSort(sort?: QueryOptions<Purchase>['sort']) {
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

  openPurchaseModal(purchase?: IPurchase) {
    const dialogRef = this.dialog.open(PurchaseModalComponent, {
      id: 'add-purchase-modal',
      data: { purchase },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
  }

  openPurchaseConfirmDeleteModal(purchase: IPurchase) {
    const dialogRef = this.dialog.open(PurchaseConfirmDeleteModalComponent, {
      id: 'confirm-delete-purchase-modal',
      data: { purchase },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.table.clearRowSelection(purchase.id);
      });
  }

  openPurchaseConfirmBulkDeleteModal(purchaseToDeleteCount: number) {
    const dialogRef = this.dialog.open(
      PurchaseConfirmBulkDeleteModalComponent,
      {
        id: 'confirm-bulk-delete-purchase-modal',
        data: {
          purchaseToDeleteCount,
          selectAll: this.selectAll,
          selectedPurchases: this.selectedPurchases,
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
