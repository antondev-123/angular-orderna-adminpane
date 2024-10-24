import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IDiscountSummary, DiscountSummary } from '../../model/discount';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import {
  ActivatedRoute,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { TableComponent } from '../../shared/components/table/table.component';
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
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { TableSkeletonComponent } from '../../shared/components/table/table-skeleton.component';
import { DATE_FILTER_OPTIONS } from '@orderna/admin-panel/src/utils/constants/filter-options';
import {
  FilterOption,
  FilterOptionItem,
} from '@orderna/admin-panel/src/types/filter';
import { IStore } from '../../model/store';
import { StoresDataSource } from '../../services/data-sources/stores.dataSource';
import { DiscountType } from '../../model/enum/discount-type';
import { DiscountsDataSource } from '../../services/data-sources/discounts.dataSource';
import { DiscountConfirmBulkDeleteModalComponent } from './components/discount-modals/discount-confirm-bulk-delete-modal.component';
import { DiscountConfirmDeleteModalComponent } from './components/discount-modals/discount-confirm-delete-modal.component';
import { DiscountStatus } from '../../model/enum/discount-status';
import { StoresApiService } from '../../core/stores/stores-api.service';
import { DiscountsApiService } from '../../services/discounts/discounts-api.service';

interface PageData {
  isLoading: boolean;
  totalDiscounts: number;
  storeFilterOptions: FilterOptionItem<IStore['id'] | 'all'>[];
}

@Component({
  selector: 'app-discounts',
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
    InputFilterCheckboxComponent,
    InputFilterImmediateComponent,

    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.css',
  providers: [CurrencyPipe],
})
export class DiscountsComponent implements OnInit {
  readonly columns: TableColumn<IDiscountSummary>[] = [
    {
      key: 'code',
      type: 'text-with-subtext',
      label: 'Code',
      getValue: (v) => {
        const formattedDiscountValue =
          v.type === DiscountType.FIXED
            ? this.currencyPipe.transform(
                v.formattedValue,
                v.currencyCode,
                'symbol',
                '1.0-0'
              )
            : `${v.formattedValue.toFixed(0)}%`;
        return {
          mainText: v.code,
          subText: `[${formattedDiscountValue} off entire order]`,
        };
      },
    },
    {
      key: 'status',
      type: 'badge',
      label: 'Status',
    },
    {
      key: 'redemptionsCount',
      type: 'number',
      label: 'Used',
    },
  ];

  readonly filterOptions: FilterOption<IDiscountSummary, 'status'>[] = [
    {
      groupName: 'status',
      options: [
        {
          label: 'Archived',
          value: DiscountStatus.ARCHIVED,
        },
        {
          label: 'Active',
          value: DiscountStatus.ACTIVE,
        },
        {
          label: 'Expired',
          value: DiscountStatus.EXPIRED,
        },
        {
          label: 'Scheduled',
          value: DiscountStatus.SCHEDULED,
        },
      ],
    },
  ];

  readonly dateFilterOptions = DATE_FILTER_OPTIONS;

  @ViewChild(TableComponent) table!: TableComponent<DiscountSummary>;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  errorMessage?: string;
  infoMessage?: string;

  selectAll: boolean = false;
  selectedDiscounts: DiscountSummary['id'][] = [];

  showDiscountModal: boolean = false;

  discountsDataSource = new DiscountsDataSource(this.discountsService);
  totalDiscounts$ = this.discountsDataSource.totalDiscounts$.asObservable();
  isLoading$ = this.discountsDataSource.isLoading$.asObservable();

  storesDataSource = new StoresDataSource(this.storesService);
  storeNames$ = this.storesDataSource.storeNames$.asObservable();

  data$!: Observable<PageData>;

  queryOptions!: QueryOptions<IDiscountSummary>;
  fallbackQueryOptions: QueryOptions<IDiscountSummary> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'createdAt', direction: 'desc' },
  };

  get showRowControls() {
    return this.selectAll || this.selectedDiscounts.length > 0;
  }

  get initialStoreFilterValue() {
    const { filters } = this.queryOptions;
    const storeFilter = filters?.find((filter) => filter.field === 'store');

    return storeFilter ? +storeFilter.value : 'all';
  }

  constructor(
    private discountsService: DiscountsApiService,
    private storesService: StoresApiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.discountsDataSource.loadTotalDiscounts();
    this.storesDataSource.loadStoreNames();

    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const optionalParamKeys = ['store', 'status'];
        const { queryOptions, error } = toQueryOptions(
          params,
          this.fallbackQueryOptions,
          optionalParamKeys
        );

        if (error) throw error;

        this.queryOptions = queryOptions!;
        this.discountsDataSource.loadDiscounts(this.queryOptions);

        return combineLatest([
          this.isLoading$,
          this.totalDiscounts$,
          this.storeNames$,
        ]).pipe(
          map(([isLoading, totalDiscounts, storeNames]) => ({
            isLoading,
            totalDiscounts,
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
            this.errorMessage = 'Error while compiling discount data';
            return of({
              isLoading: false, // Default fallback values
              totalDiscounts: 0,
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

  getSelectedDiscountsCount(totalDiscounts: number) {
    return this.selectAll
      ? totalDiscounts - this.selectedDiscounts.length
      : this.selectedDiscounts.length;
  }

  handleSearch(searchTerm: string) {
    console.log(`Searching for ${searchTerm}`);
    this.updateQueryParams({ search: searchTerm || undefined });
  }

  handleFilter(
    filters: (
      | string
      | { groupName: keyof IDiscountSummary; filters: string[] }
    )[]
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

  handleRowsSelectedChange(ids: DiscountSummary['id'][]) {
    this.selectedDiscounts = ids;
  }

  handleSort(sort?: QueryOptions<DiscountSummary>['sort']) {
    if (sort) {
      const { field, direction } = sort;
      console.log(`Sorting ${field} in ${direction}ending order`);
      this.updateQueryParams({ sort: `${field}_${direction}` });
    } else {
      console.log(`Sorting cleared`);
      this.updateQueryParams({ sort: undefined });
    }
  }

  openDiscountConfirmDeleteModal(discount: IDiscountSummary) {
    const dialogRef = this.dialog.open(DiscountConfirmDeleteModalComponent, {
      id: 'confirm-delete-discount-modal',
      data: { discount },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.table.clearRowSelection(discount.id);
      });
  }

  openDiscountConfirmBulkDeleteModal(discountsToDeleteCount: number) {
    const dialogRef = this.dialog.open(
      DiscountConfirmBulkDeleteModalComponent,
      {
        id: 'confirm-bulk-delete-discount-modal',
        data: {
          discountsToDeleteCount,
          selectAll: this.selectAll,
          selectedDiscounts: this.selectedDiscounts,
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

  goToDiscountDetailPage(discount: IDiscountSummary) {
    this.router.navigate(['discounts', discount.id]);
  }

  goToDiscountCreatePage() {
    this.router.navigate(['discounts', 'create']);
  }

  goToDiscountUpdatePage(discount: IDiscountSummary) {
    this.router.navigate(['discounts', 'edit', discount.id]);
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
