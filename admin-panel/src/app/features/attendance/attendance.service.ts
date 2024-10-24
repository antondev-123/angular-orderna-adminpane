import { Injectable } from '@angular/core';
import { DateFilter } from '@orderna/admin-panel/src/types/date-filter';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Observable, delay, of } from 'rxjs';
import { STORES } from '../../data/stores';
import { USERS } from '../../data/users';
import { Attendance } from '../../model/attendance';
import { AttendanceResponse } from '../../model/attendance-response';
import { AttendanceSummary } from '../../model/attendance-summary';
import { Store } from '../../model/store';
import { User } from '../../model/user';
import { ATTENDANCES } from './attendance.data';

let randomId = 1000;

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  attendances = [...ATTENDANCES];

  getTodayAttendance(userId: number): Observable<Attendance | undefined> {
    const todayAttendance = this.attendances.find(
      (attendance) =>
        attendance.user.id === userId &&
        attendance.date.toDateString() === new Date().toDateString()
    );
    return todayAttendance
      ? of(new Attendance(todayAttendance))
      : of(undefined);
  }

  getAttendanceById(id: number): Observable<Attendance | undefined> {
    const attendance = this.attendances.find(
      (attendance) => attendance.id === id
    );

    return attendance ? of(new Attendance(attendance)) : of(undefined);
  }

  clockIn(
    userId: number,
    storeId: number,
    clockInImage: string
  ): Observable<Attendance> {
    const user = USERS.find((user) => user.id === +userId) as User;
    const store = STORES.find((store) => store.id === +storeId) as Store;

    const newAttendance = new Attendance({
      id: randomId++,
      clockIn: new Date(),
      clockInImage,
      user,
      store,
      date: new Date(),
      wagePerHour: 40,
      breaks: [],
    });
    this.attendances.unshift(newAttendance);
    return of(newAttendance);
  }

  updateClockInImage(id: number, image: string): Observable<Attendance> {
    const attendance = this.attendances.find(
      (attendance) => attendance.id === id
    );

    if (attendance) {
      attendance.clockInImage = image;
    }

    return of(new Attendance(attendance!));
  }

  clockOut(id: number, image: string): Observable<Attendance> {
    const attendance = this.attendances.find(
      (attendance) => attendance.id === id
    );
    if (attendance) {
      attendance.clockOut = new Date();
      attendance.clockOutImage = image;
    }
    return of(new Attendance(attendance!));
  }

  updateClockOutImage(id: number, image: string) {
    const attendance = this.attendances.find(
      (attendance) => attendance.id === id
    );
    if (attendance) {
      attendance.clockOutImage = image;
    }
    return of(new Attendance(attendance!));
  }

  changeAttendanceStore(id: number, storeId: number): Observable<Attendance> {
    const attendance = this.attendances.find(
      (attendance) => attendance.id === id
    );

    if (attendance) {
      attendance.store = STORES.find((store) => store.id === +storeId) as Store;
      return of(new Attendance(attendance));
    }
    return of();
  }

  startBreak(id: number): Observable<Attendance> {
    const todayAttendance = this.attendances.find(
      (attendance) =>
        attendance.id === id &&
        attendance.date.toDateString() === new Date().toDateString()
    );

    todayAttendance!.activeBreak = new Date();
    return of(new Attendance(todayAttendance!));
  }

  endBreak(id: number): Observable<Attendance> {
    const todayAttendance = this.attendances.find(
      (attendance) =>
        attendance.id === id &&
        attendance.date.toDateString() === new Date().toDateString()
    );

    todayAttendance?.breaks.push({
      id: randomId++,
      attendanceId: todayAttendance.id,
      start: todayAttendance.activeBreak!,
      end: new Date(),
    });

    todayAttendance!.activeBreak = undefined;

    return of(new Attendance(todayAttendance!));
  }

  getAllByFilter(
    filter: QueryOptions<AttendanceSummary>
  ): Observable<AttendanceResponse> {
    let filteredAttendances = [...this.attendances];

    if (filter.dateFilter && filter.dateFilter !== DateFilter.MAX) {
      const minDate = this.getMinDate(filter.dateFilter as DateFilter);
      minDate.setHours(0, 0, 0, 0);
      filteredAttendances = filteredAttendances.filter(
        (attendance) => attendance.date >= minDate
      );
    }

    const store = filter.filters?.find(
      (filter) => filter.field === 'store'
    )?.value;
    if (store && store !== 'all') {
      filteredAttendances = filteredAttendances.filter(
        (attendance) => attendance.store.id === +store
      );
    }

    if (filter.searchQuery && filter.searchQuery !== '') {
      filteredAttendances = filteredAttendances.filter((attendance) => {
        const userName = `${attendance.user.firstName} ${attendance.user.lastName}`;
        return userName.toLowerCase().includes(filter.searchQuery as string);
      });
    }

    const data: AttendanceResponse = {
      filteredAttendances: filteredAttendances.slice(
        (filter.page - 1) * filter.perPage,
        filter.page * filter.perPage
      ),
      totalFiltered: filteredAttendances.length,
      totalAttendances: this.attendances.length,
    };

    return of(data).pipe(delay(1000));
  }

  deleteBulks(ids: number[]): Observable<number[]> {
    this.attendances = this.attendances.filter(
      (attendance) => !ids.includes(attendance.id)
    );
    return of(ids).pipe(delay(1000));
  }

  deleteById(id: number): Observable<number> {
    this.attendances = this.attendances.filter(
      (attendance) => attendance.id !== id
    );
    return of(id).pipe(delay(1000));
  }

  deleteAll(): Observable<null> {
    this.attendances = [];
    return of(null).pipe(delay(1000));
  }

  deleteAllWithExceptions(exceptions: number[]): Observable<number[]> {
    this.attendances = this.attendances.filter((attendance) =>
      exceptions.includes(attendance.id)
    );
    return of(exceptions).pipe(delay(1000));
  }

  private getMinDate(dateFilter: DateFilter): Date {
    const date = new Date();

    switch (dateFilter) {
      case DateFilter.TODAY:
        return date;

      case DateFilter.LAST_7_DAYS:
        date.setDate(date.getDate() - 7);
        return date;

      case DateFilter.LAST_4_WEEKS:
        date.setDate(date.getDate() - 28);
        return date;

      case DateFilter.LAST_12_MONTHS:
        date.setFullYear(date.getFullYear() - 1);
        return date;

      default:
        return new Date('1970-01-01');
    }
  }
}
