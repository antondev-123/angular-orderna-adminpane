import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FilterOptionItem } from '@orderna/admin-panel/src/types/filter';
import { IStore } from '../../../model/store';
import { CommonModule, DatePipe } from '@angular/common';
import { InputFilterImmediateComponent } from '../../../shared/components/input/filter-immediate/filter-immediate.component';
import { InputDateRangeComponent } from '../../../shared/components/input/daterange/daterange.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { RowControlComponent } from '../../../shared/components/row-controls/row-controls.component';
import { TableSkeletonComponent } from '../../../shared/components/table/table-skeleton.component';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import { ICashRegister } from '../../../model/cash-register';
import {
  DEFAULT_QUERY_OPTIONS,
  QueryOptions,
  toQueryOptions,
} from '@orderna/admin-panel/src/types/query-options';
import {
  ActivatedRoute,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import { StoresDataSource } from '../../../services/data-sources/stores.dataSource';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
} from 'rxjs';
import { CashRegistersDataSource } from '../../../services/data-sources/cash-registers.dataSource';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { DateFilter } from '@orderna/admin-panel/src/types/date-filter';
import { StoresApiService } from '../../../core/stores/stores-api.service';
import { CashRegistersApiService } from '../../../services/cash-registers-analytics/cash-registers/cash-registers-api.service';

interface PageData {
  isLoading: boolean;
  totalRecords: number;
  storeFilterOptions: FilterOptionItem<IStore['id']>[];
}

@Component({
  selector: 'app-register',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    CommonModule,

    InputFilterImmediateComponent,
    InputDateRangeComponent,

    TableComponent,
    TableSkeletonComponent,
    RowControlComponent,
    PaginationComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  readonly columns: TableColumn<ICashRegister>[] = [
    { key: 'title', label: 'Register', type: 'string' },
    { key: 'counted', label: '#', type: 'string' },
    {
      key: 'opened',
      label: 'Time Opened',
      type: 'date',
      getValue: (v) => this.datePipe.transform(v.opened, 'dd.MM.yyyy, HH:mm'),
    },
    {
      key: 'closed',
      label: 'Time Closed',
      type: 'date',
      getValue: (v) => this.datePipe.transform(v.closed, 'dd.MM.yyyy, HH:mm'),
    },
    {
      key: 'cashEnd',
      label: 'Cash',
      type: 'currency',
      getValue: (v) => v.cashManagement.cashEnd,
    },
    {
      key: 'cashOut',
      label: 'Store Credit',
      type: 'currency',
      getValue: (v) => v.cashManagement.cashOut,
    },
    {
      key: 'total',
      label: 'Total',
      type: 'currency',
      getValue: (v) => v.cashManagement.cashEnd - v.cashManagement.cashOut,
    },
  ];

  queryOptions!: QueryOptions<ICashRegister>;
  fallbackQueryOptions: QueryOptions<ICashRegister> = {
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

  cashRegistersDataSource = new CashRegistersDataSource(
    this.cashRegistersService
  );
  cashRegisters$ = this.cashRegistersDataSource.cashRegisters$.asObservable();
  isLoading$ = this.cashRegistersDataSource.isLoading$.asObservable();
  totalCashRegisters$ =
    this.cashRegistersDataSource.totalCashRegisters$.asObservable();

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

  @ViewChild(TableComponent) table!: TableComponent<ICashRegister>;

  constructor(
    private cashRegistersService: CashRegistersApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.storesDataSource.loadStoreNames();
    this.cashRegistersDataSource.loadTotalCashRegisters();

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

        this.cashRegistersDataSource.loadCashRegisters(this.queryOptions);

        return combineLatest([
          this.isLoading$,
          this.totalCashRegisters$,
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
  }

  handleStoreFilter(filter?: IStore['id'][]) {
    this.updateQueryParams({ store: filter });
  }

  handleDateFilter(filter?: string) {
    this.updateQueryParams({ dateFilter: filter });
  }

  handleSort(sort?: QueryOptions<ICashRegister>['sort']) {
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
