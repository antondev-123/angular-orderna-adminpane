import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { IInventoryItem, InventoryItem } from '../../../model/inventory';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import { DATE_FILTER_OPTIONS } from '@orderna/admin-panel/src/utils/constants/filter-options';
import { TableComponent } from '../../../shared/components/table/table.component';
import {
  ActivatedRoute,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import { InventorysDataSource } from '../../../services/data-sources/inventory.dataSource';
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
import { MatDialog } from '@angular/material/dialog';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { InventoryConfirmDeleteModalComponent } from './components/inventory-modals/inventory-confirm-delete-modal.component';
import { InventoryConfirmBulkDeleteModalComponent } from './components/inventory-modals/inventory-confirm-bulk-delete-modal.component';
import { InventoryModalComponent } from './components/inventory-modals/inventory-modal.component';
import { FilterOptionItem } from '@orderna/admin-panel/src/types/filter';
import { IStore } from '../../../model/store';
import { StoresDataSource } from '../../../services/data-sources/stores.dataSource';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../shared/components/button/button.component';
import { TableSkeletonComponent } from '../../../shared/components/table/table-skeleton.component';
import { RowControlComponent } from '../../../shared/components/row-controls/row-controls.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { InputSearchComponent } from '../../../shared/components/input/search/search.component';
import { InputFilterImmediateComponent } from '../../../shared/components/input/filter-immediate/filter-immediate.component';
import { InputFilterCheckboxComponent } from '../../../shared/components/input/filter-checkbox/filter-checkbox.component';
import { StoresApiService } from '../../../core/stores/stores-api.service';
import { InventoryApiService } from '../../../services/inventory/inventory-api.service';
import { MatTableDataSource } from '@angular/material/table';

interface PageData {
  isLoading: boolean;
  totalInventorys: number;
  storeFilterOptions: FilterOptionItem<IStore['id'] | 'all'>[];
}
@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ButtonComponent,
    ButtonTextDirective,
    TableComponent,
    TableSkeletonComponent,
    RowControlComponent,
    PaginationComponent,
    InputSearchComponent,
    InputFilterImmediateComponent,
    InputFilterCheckboxComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent {
  readonly columns: TableColumn<IInventoryItem>[] = [
    {
      key: 'id',
      type: 'id',
      label: 'ID',
    },
    {
      key: 'title',
      type: 'string',
      label: 'Item',
    },
    {
      key: 'unit',
      type: 'round-img-plus-string',
      label: 'Unit',
    },
    {
      key: 'sk_plu',
      type: 'string',
      label: 'SKU/PLU',
    },
    {
      key: 'storeId',
      type: 'string',
      label: 'Store',
      getValue: (v) =>
         {
            let storeName = ''
            this.stores$.subscribe((stores: any[]) => {
            const store = stores.find((store) => store.id == v.storeId);
              if (store) {
                storeName = store.name;
              } 
            })
          return storeName;
        }
    },
  ];

  readonly dateFilterOptions = DATE_FILTER_OPTIONS;
  @ViewChild(TableComponent) table!: TableComponent<InventoryItem>;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  errorMessage?: string;
  infoMessage?: string;

  selectAll: boolean = false;
  selectedInventorys: InventoryItem['id'][] = [];

  dataSource = new MatTableDataSource<IInventoryItem>([]);
  totalRecord:any;

  inventorysDataSource = new InventorysDataSource(this.inventoryService);
  totalInventorys$ = this.inventorysDataSource.totalInventorys$.asObservable();
  isLoading$ = this.inventorysDataSource.isLoading$.asObservable();

  storesDataSource = new StoresDataSource(this.storesService);
  stores$ = this.storesDataSource.stores$.asObservable();;

  data$!: Observable<PageData>;

  queryOptions!: QueryOptions<IInventoryItem>;
  fallbackQueryOptions: QueryOptions<IInventoryItem> = {
    ...DEFAULT_QUERY_OPTIONS,
    // sort: { field: 'createdAt', direction: 'desc' },
  };

  get initialStoreFilterValue() {
    const { filters } = this.queryOptions;
    const storeFilter = filters?.find((filter) => filter.field === 'store');

    return storeFilter ? +storeFilter.value : 'all';
  }
  constructor(
    private inventoryService: InventoryApiService,
    private storesService: StoresApiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.inventorysDataSource.loadTotalInventorys();
    this.storesDataSource.loadStores(1, 5000);

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
        this.getInventory();
        return combineLatest([
          this.isLoading$,
          this.totalInventorys$,
          this.stores$,
        ]).pipe(
          map(([isLoading, totalInventorys, storeNames]) => ({
            isLoading,
            totalInventorys,
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
            this.errorMessage = 'Error while compiling Inventory data';
            return of({
              isLoading: false,
              totalInventorys: 0,
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
  getInventory()
  {
    this.inventoryService
    .getInventory(this.queryOptions)
    .subscribe((inventorys) => {
      this.dataSource.data = inventorys.data.inventories;
      this.totalRecord = inventorys.data.total_record 
    });
  }

  getSelectedInventorysCount(totalInventorys: number) {
    return this.selectAll
      ? totalInventorys
      : this.selectedInventorys.length;
  }
  handleSearch(searchTerm: string) {
    this.updateQueryParams({ search: searchTerm || undefined });
  }

  handleFilter(
    filters: (string | { groupName: keyof IInventoryItem; filters: string[] })[]
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

  handleRowsSelectedChange(ids: InventoryItem['id'][]) {
    this.selectedInventorys = ids;
  }
  handleDateFilter(filter?: string) {
    this.updateQueryParams({ dateFilter: filter || undefined });
  }

  handleStoreFilter(storeId?: IStore['id'] | 'all') {
    if (storeId === 'all') {
      this.updateQueryParams({ store: undefined });
    } else {
      let storeName = '';
      this.stores$.pipe(take(1)).subscribe(stores => {
        const selectedStore = stores.find(store => store.id === storeId);
        if (selectedStore) {
          storeName = selectedStore.name;
        }
      });
      
      this.updateQueryParams({ store: storeName});
    }
  }

  handleSort(sort?: QueryOptions<InventoryItem>['sort']) {
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

  openInventoryModal(inventory?: IInventoryItem) {
    const dialogRef = this.dialog.open(InventoryModalComponent, {
      id: 'add-inventory-modal',
      data: { inventory },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.getInventory();
      });
  }

  openInventoryConfirmDeleteModal(inventory: IInventoryItem) {
    const dialogRef = this.dialog.open(InventoryConfirmDeleteModalComponent, {
      id: 'confirm-delete-inventory-modal',
      data: { inventory },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.table.clearRowSelection(inventory.id);
        this.getInventory();
      });
  }

  openInventoryConfirmBulkDeleteModal(inventorysToDeleteCount: number) {
    const dialogRef = this.dialog.open(
      InventoryConfirmBulkDeleteModalComponent,
      {
        id: 'confirm-bulk-delete-inventory-modal',
        data: {
          inventorysToDeleteCount,
          selectAll: this.selectAll,
          selectedInventorys: this.selectedInventorys,
        },
      }
    );

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.table.clearRowSelection();
        this.getInventory();
      });
  }
}
