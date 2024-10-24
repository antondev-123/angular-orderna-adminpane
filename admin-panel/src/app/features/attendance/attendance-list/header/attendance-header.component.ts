import { Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { InputFilterImmediateComponent } from '@orderna/admin-panel/src/app/shared/components/input/filter-immediate/filter-immediate.component';
import { InputSearchComponent } from '@orderna/admin-panel/src/app/shared/components/input/search/search.component';
import { RowControlComponent } from '@orderna/admin-panel/src/app/shared/components/row-controls/row-controls.component';
import { AttendanceSummary } from '@orderna/admin-panel/src/app/model/attendance-summary';
import { StoresApiService } from '@orderna/admin-panel/src/app/core/stores/stores-api.service';
import { DateFilter } from '@orderna/admin-panel/src/types/date-filter';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { DATE_FILTER_OPTIONS } from '@orderna/admin-panel/src/utils/constants/filter-options';

@Component({
  selector: 'app-attendance-header',
  templateUrl: './attendance-header.component.html',
  styleUrl: './attendance-header.component.scss',
  standalone: true,
  imports: [
    InputSearchComponent,
    InputFilterImmediateComponent,
    ButtonComponent,
    ButtonTextDirective,
    RowControlComponent,
  ],
})
export class AttendanceHeaderComponent {
  readonly dateFilterOptions = DATE_FILTER_OPTIONS;

  filter = input.required<QueryOptions<AttendanceSummary>>();
  selectedCount = input.required<number>();
  deleteTriggered = output<void>();

  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #storesService = inject(StoresApiService);
  #stores = toSignal(this.#storesService.getStoreNames());

  storeFilterOptions = computed(() => [
    {
      value: 'all',
      label: 'All Stores',
    },
    ...this.#stores()!.map((store) => ({
      value: store.id.toString(),
      label: store.name,
    })),
  ]);

  protected store = computed(
    () =>
      this.filter().filters?.find((filter) => filter.field === 'store')?.value
  );

  protected onSearchedUserChange(search: string): void {
    if (search === '') {
      this.updateQueryParams({ search: undefined });
      return;
    }

    this.updateQueryParams({ search });
  }

  protected onDateRangeChange(dateFilter: DateFilter): void {
    this.updateQueryParams({ dateFilter });
  }

  protected onStoreChange(store: number | 'all'): void {
    if (store === 'all') {
      this.updateQueryParams({ store: undefined });
      return;
    }

    this.updateQueryParams({ store });
  }

  protected onConfirmDelete(): void {
    this.deleteTriggered.emit();
  }

  protected recordAttendance(): void {
    this.#router.navigate(['record'], { relativeTo: this.#activatedRoute });
  }

  private updateQueryParams(
    updatedParams: Maybe<Params>,
    handling: QueryParamsHandling = 'merge'
  ) {
    this.#router.navigate([], {
      relativeTo: this.#activatedRoute,
      queryParams: updatedParams,
      queryParamsHandling: handling,
      replaceUrl: false, // adds new history to URL
    });
  }
}
