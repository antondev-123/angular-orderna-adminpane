import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { toQueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import { DeleteConfirmationDialogComponent } from '../../../shared/components/modal/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TableSkeletonComponent } from '../../../shared/components/table/table-skeleton.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { AttendanceSummary } from '../../../model/attendance-summary';
import {
  AttendancesState,
  DEFAULT_ATTENDANCE_FILTER,
} from '../attendance.state';
import { AttendanceHeaderComponent } from './header/attendance-header.component';

const COLUMNS: TableColumn<AttendanceSummary>[] = [
  {
    key: 'userName',
    type: 'string',
    label: 'Name',
  },
  {
    key: 'date',
    type: 'date',
    label: 'Date',
  },
  {
    key: 'breakHours',
    type: 'number',
    label: 'Break Hours',
  },
  {
    key: 'totalHours',
    type: 'number',
    label: 'Total Hour Mins',
  },
  {
    key: 'hourlyPay',
    type: 'number',
    label: 'Hourly Pay',
  },
  {
    key: 'totalPay',
    type: 'number',
    label: 'Total Pay',
  },
];

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [
    TableSkeletonComponent,
    AttendanceHeaderComponent,
    TableComponent,
    PaginationComponent,
  ],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class AttendanceListComponent {
  readonly columns = COLUMNS;

  #activatedRoute = inject(ActivatedRoute);
  #attendancesStore = inject(AttendancesState);
  #queryParams = toSignal(this.#activatedRoute.queryParams);
  #matDialog = inject(MatDialog);
  #datePipe = inject(DatePipe);
  #router = inject(Router);

  table = viewChild.required(TableComponent<AttendanceSummary>);

  protected selectedIds = signal<number[]>([]);
  protected allRowsSelected = signal(false);
  protected selectedCount = signal(0);
  protected viewModel = this.#attendancesStore.viewModel;

  protected attendanceSummaries = computed(() =>
    this.viewModel().attendanceSummaries.map((attendance) => ({
      ...attendance,
      totalHours: attendance.totalHours || 'Not available yet',
      totalPay: attendance.totalPay || 'Not available yet',
    }))
  );

  #filterChangeListener = effect(
    () => {
      const optionalParamKeys = ['store'];
      const { queryOptions } = toQueryOptions(
        this.#queryParams()!,
        JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE_FILTER)),
        optionalParamKeys
      );

      this.#attendancesStore.changeFilter(queryOptions!);
    },
    { allowSignalWrites: true }
  );

  protected onRowClicked(summary: AttendanceSummary): void {
    this.#router.navigate(['details', summary.id], {
      relativeTo: this.#activatedRoute,
    });
  }

  protected onRowEdited(summary: AttendanceSummary): void {
    this.#router.navigate(['edit', summary.id], {
      relativeTo: this.#activatedRoute,
    });
  }

  protected onRowSelected(ids: number[]): void {
    let count = ids.length;
    if (this.allRowsSelected()) {
      count = this.viewModel().totalAttendances - ids.length;
    }

    this.selectedCount.set(count);
    this.selectedIds.set(ids);
  }

  protected onAllRowsSelected(selected: boolean): void {
    this.selectedCount.set(selected ? this.viewModel().totalAttendances : 0);
    this.allRowsSelected.set(selected);
  }

  protected onRowDeleted(summary: AttendanceSummary): void {
    const formatDate = this.#datePipe.transform(summary.date, 'MMM dd, yyyy');
    const dialogRef = this.#matDialog.open(DeleteConfirmationDialogComponent, {
      data: `Are you sure you want to delete the attendance of <b>${summary.userName}</b> on <b>${formatDate}</b>?`,
    });
    dialogRef.componentInstance.deleteConfirmed.subscribe(async () => {
      await this.#attendancesStore.deleteById(summary.id);
      this.table().clearRowSelection(summary.id);
      dialogRef.close();
    });
  }

  protected onSelectedRowsDeleted(): void {
    const isDeletingAll =
      this.selectedCount() === this.viewModel().totalAttendances;
    const countToDelete = isDeletingAll ? 'all' : this.selectedCount();
    const message = `Are you sure you want to delete <b>${countToDelete}</b> attendances?`;
    const dialogRef = this.#matDialog.open(DeleteConfirmationDialogComponent, {
      data: message,
    });

    dialogRef.componentInstance.deleteConfirmed.subscribe(async () => {
      await this.deleteAttendances(isDeletingAll);
      this.cleanUpSelection();
      dialogRef.close();
    });
  }

  private async deleteAttendances(isDeletingAll: boolean): Promise<void> {
    const hasSelectedIds = this.selectedIds().length > 0;
    const allRowsAreSelected = this.allRowsSelected();

    if (isDeletingAll) {
      await this.#attendancesStore.deleteAll();
    } else if (allRowsAreSelected && hasSelectedIds) {
      await this.#attendancesStore.deleteAllWithExceptions(this.selectedIds());
    } else if (!allRowsAreSelected && hasSelectedIds) {
      await this.#attendancesStore.deleteBulks(this.selectedIds());
    }
  }

  private cleanUpSelection(): void {
    this.selectedCount.set(0);
    this.allRowsSelected.set(false);
    this.clearSelection();
  }

  protected clearSelection(): void {
    this.table().clearRowSelection();
  }
}
