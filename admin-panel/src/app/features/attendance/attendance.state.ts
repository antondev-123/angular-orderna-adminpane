import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DateFilter } from '@orderna/admin-panel/src/types/date-filter';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { firstValueFrom } from 'rxjs';
import { Attendance } from '../../model/attendance';
import { AttendanceSummary } from '../../model/attendance-summary';
import { AttendanceService } from './attendance.service';

type AttendanceState = {
  isLoading: boolean;
  filter: QueryOptions<AttendanceSummary>;
  filteredAttendances: Attendance[];
  totalFiltered: number;
  totalAttendances: number;
  attendanceSummaries: AttendanceSummary[];
  selectedAttendance: Attendance | undefined;
};

export const DEFAULT_ATTENDANCE_FILTER = {
  dateFilter: DateFilter.TODAY,
  searchQuery: '',
  page: 1,
  perPage: 10,
  filters: [
    {
      field: 'store',
      value: 'all',
    },
  ],
};

const initialState: AttendanceState = {
  isLoading: false,
  filteredAttendances: [],
  attendanceSummaries: [],
  totalFiltered: 0,
  totalAttendances: 0,
  filter: DEFAULT_ATTENDANCE_FILTER,
  selectedAttendance: undefined,
};

export const AttendancesState = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(
    ({
      filteredAttendances: attendances,
      totalFiltered,
      totalAttendances,
      isLoading,
      filter,
    }) => ({
      viewModel: computed(() => ({
        isLoading: isLoading(),
        filter: filter(),
        attendanceSummaries: attendances().map((a) => a.toAttendanceSummary()),
        totalFiltered: totalFiltered(),
        totalAttendances: totalAttendances(),
      })),
    })
  ),
  withMethods((store, attendanceService = inject(AttendanceService)) => ({
    async loadAll() {
      patchState(store, { isLoading: true });
      const data = await firstValueFrom(
        attendanceService.getAllByFilter(store.filter())
      );
      patchState(store, {
        filteredAttendances: data.filteredAttendances.map(
          (a) => new Attendance(a)
        ),
        totalFiltered: data.totalFiltered,
        totalAttendances: data.totalAttendances,
        isLoading: false,
      });
    },
    async deleteBulks(attendanceIds: number[]) {
      await firstValueFrom(attendanceService.deleteBulks(attendanceIds));
      this.loadAll();
    },
    async deleteAllWithExceptions(exceptions: number[]) {
      await firstValueFrom(
        attendanceService.deleteAllWithExceptions(exceptions)
      );
      this.loadAll();
    },
    async deleteAll() {
      await firstValueFrom(attendanceService.deleteAll());
      this.loadAll();
    },
    async deleteById(id: number) {
      await firstValueFrom(attendanceService.deleteById(id));
      this.loadAll();
    },
    async getTodayAttendance(userId: number) {
      const attendance = await firstValueFrom(
        attendanceService.getTodayAttendance(userId)
      );
      patchState(store, { selectedAttendance: attendance });
    },
    async clockIn(attendanceId: number, storeId: number, clockInImage: string) {
      const attendance = await firstValueFrom(
        attendanceService.clockIn(attendanceId, storeId, clockInImage)
      );
      patchState(store, { selectedAttendance: attendance });
    },
    async updateClockInImage(attendanceId: number, image: string) {
      const attendance = await firstValueFrom(
        attendanceService.updateClockInImage(attendanceId, image)
      );
      patchState(store, { selectedAttendance: attendance });
    },
    async clockOut(attendanceId: number, image: string) {
      const attendance = await firstValueFrom(
        attendanceService.clockOut(attendanceId, image)
      );
      patchState(store, { selectedAttendance: attendance });
    },
    async updateClockOutImage(attendanceId: number, image: string) {
      const attendance = await firstValueFrom(
        attendanceService.updateClockOutImage(attendanceId, image)
      );
      patchState(store, { selectedAttendance: attendance });
    },
    async changeAttendanceStore(attendanceId: number, storeId: number) {
      await firstValueFrom(
        attendanceService.changeAttendanceStore(attendanceId, storeId)
      );
    },
    changeFilter(filter: QueryOptions<AttendanceSummary>): void {
      patchState(store, { filter });
      this.loadAll();
    },
    async startBreak(userId: number) {
      const attendance = await firstValueFrom(
        attendanceService.startBreak(userId)
      );
      patchState(store, { selectedAttendance: attendance });
    },
    async endBreak(userId: number) {
      const attendance = await firstValueFrom(
        attendanceService.endBreak(userId)
      );

      patchState(store, { selectedAttendance: attendance });
    },

    async getAttendanceById(id: number) {
      const attendance = await firstValueFrom(
        attendanceService.getAttendanceById(id)
      );
      patchState(store, { selectedAttendance: attendance });
    },
  }))
);
