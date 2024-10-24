import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser, User } from '../../model/user';
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
import { FilterOption } from '@orderna/admin-panel/src/types/filter';
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
import { UsersDataSource } from '../../services/data-sources/users.dataSource';
import { formatPhilippinePhoneNumber } from '@orderna/admin-panel/src/utils/format';
import { UserConfirmDeleteModalComponent } from './components/user-modals/user-confirm-delete-modal.component';
import { UserConfirmBulkDeleteModalComponent } from './components/user-modals/user-confirm-bulk-delete-modal.component';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { TableSkeletonComponent } from '../../shared/components/table/table-skeleton.component';
import {
  STATUS_FILTER_OPTIONS,
  ROLE_FILTER_OPTIONS,
  DATE_FILTER_OPTIONS,
} from '@orderna/admin-panel/src/utils/constants/filter-options';
import { UserModalComponent } from './components/user-modals/user-modal.component';
import { UsersApiService } from '../../services/users/users-api.service';

interface PageData {
  isLoading: boolean;
  totalUsers: number;
}

@Component({
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  readonly columns: TableColumn<IUser>[] = [
    {
      key: 'id',
      type: 'id',
      label: 'User ID',
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
      getValue: (v) => formatPhilippinePhoneNumber(v.mobile.number),
    },
    {
      key: 'jobTitle',
      type: 'string',
      label: 'Job Title',
    },
    {
      key: 'role',
      type: 'string',
      label: 'Role',
      getValue: (v) =>
        v.role.charAt(0).toUpperCase() + v.role.slice(1).toLowerCase(),
    },
    {
      key: 'status',
      type: 'badge',
      label: 'Status',
    },
  ];

  readonly dateFilterOptions = DATE_FILTER_OPTIONS;

  readonly filterOptions: FilterOption<IUser, 'status' | 'role'>[] = [
    {
      groupName: 'status',
      options: STATUS_FILTER_OPTIONS,
    },
    {
      groupName: 'role',
      options: ROLE_FILTER_OPTIONS,
    },
  ];

  @ViewChild(TableComponent) table!: TableComponent<User>;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  errorMessage?: string;
  infoMessage?: string;

  selectAll: boolean = false;
  selectedUsers: User['id'][] = [];

  showUserModal: boolean = false;

  dataSource = new UsersDataSource(this.usersService);
  totalUsers$ = this.dataSource.totalUsers$.asObservable();
  isLoading$ = this.dataSource.isLoading$.asObservable();
  data$!: Observable<PageData>;

  queryOptions!: QueryOptions<IUser>;
  fallbackQueryOptions: QueryOptions<IUser> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'createdAt', direction: 'desc' },
  };

  get showRowControls() {
    return this.selectAll || this.selectedUsers.length > 0;
  }

  constructor(
    private usersService: UsersApiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataSource.loadTotalUsers();

    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        const optionalParamKeys = ['role', 'status'];
        const { queryOptions, error } = toQueryOptions(
          params,
          this.fallbackQueryOptions,
          optionalParamKeys
        );

        if (error) throw error;

        this.queryOptions = queryOptions!;
        this.dataSource.loadUsers(this.queryOptions);

        return combineLatest([this.isLoading$, this.totalUsers$]).pipe(
          map(([isLoading, totalUsers]) => ({
            isLoading,
            totalUsers,
          })),
          catchError(() => {
            this.errorMessage = 'Error while compiling user data';
            return of({
              isLoading: false, // Default fallback values
              totalUsers: 0,
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

  getSelectedUsersCount(totalUsers: number) {
    return this.selectAll
      ? totalUsers - this.selectedUsers.length
      : this.selectedUsers.length;
  }

  handleSearch(searchTerm: string) {
    console.log(`Searching for ${searchTerm}`);
    this.updateQueryParams({ search: searchTerm || undefined });
  }

  handleFilter(
    filters: (string | { groupName: keyof IUser; filters: string[] })[]
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

  handleAllRowsSelectedChange(value: boolean) {
    this.selectAll = value;
  }

  handleRowsSelectedChange(ids: User['id'][]) {
    this.selectedUsers = ids;
  }

  handleSort(sort?: QueryOptions<User>['sort']) {
    if (sort) {
      const { field, direction } = sort;
      console.log(`Sorting ${field} in ${direction}ending order`);
      this.updateQueryParams({ sort: `${field}_${direction}` });
    } else {
      console.log(`Sorting cleared`);
      this.updateQueryParams({ sort: undefined });
    }
  }

  openUserModal(user?: IUser) {
    const dialogRef = this.dialog.open(UserModalComponent, {
      id: 'add-user-modal',
      data: { user },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
  }

  openUserConfirmDeleteModal(user: IUser) {
    const dialogRef = this.dialog.open(UserConfirmDeleteModalComponent, {
      id: 'confirm-delete-user-modal',
      data: { user },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.table.clearRowSelection(user.id);
      });
  }

  openUserConfirmBulkDeleteModal(usersToDeleteCount: number) {
    const dialogRef = this.dialog.open(UserConfirmBulkDeleteModalComponent, {
      id: 'confirm-bulk-delete-user-modal',
      data: {
        usersToDeleteCount,
        selectAll: this.selectAll,
        selectedUsers: this.selectedUsers,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.table.clearRowSelection();
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
