import { DateFilter } from '@orderna/admin-panel/src/types/date-filter';
import { STORES } from '../../data/stores';
import { USERS } from '../../data/users';
import { AttendanceDto } from '../../model/attendance-response';

function getAttendanceDate(dateFilter: DateFilter): Date {
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

    default:
      return date;
  }
}

function getClockInTime(date: Date): Date {
  const clockIn = new Date(date);
  clockIn.setHours(9);
  clockIn.setMinutes(0);
  return clockIn;
}

function getClockOutTime(date: Date): Date {
  const clockOut = new Date(date);
  clockOut.setHours(17);
  clockOut.setMinutes(0);
  return clockOut;
}

function getBreakStart(date: Date): Date {
  const start = new Date(date);
  start.setHours(12);
  start.setMinutes(0);
  return start;
}

function getBreakEnd(date: Date): Date {
  const end = new Date(date);
  end.setHours(13);
  end.setMinutes(0);
  return end;
}

export const ATTENDANCES: AttendanceDto[] = [
  {
    id: 6,
    user: USERS[0],
    store: STORES[0],
    date: getAttendanceDate(DateFilter.LAST_7_DAYS),
    clockIn: getClockInTime(new Date()),
    clockOut: getClockOutTime(new Date()),
    wagePerHour: 10,
    breaks: [
      {
        id: 6,
        attendanceId: 6,
        start: getBreakStart(new Date()),
        end: getBreakEnd(new Date()),
      },
    ],
    clockInImage: 'https://picsum.photos/400/300',
    clockOutImage: 'https://picsum.photos/400/300',
  },
  {
    id: 7,
    user: USERS[1],
    store: STORES[1],
    date: getAttendanceDate(DateFilter.LAST_7_DAYS),
    clockIn: getClockInTime(new Date()),
    clockOut: getClockOutTime(new Date()),
    wagePerHour: 10,
    breaks: [
      {
        id: 7,
        attendanceId: 7,
        start: getBreakStart(new Date()),
        end: getBreakEnd(new Date()),
      },
    ],
    clockInImage: 'https://picsum.photos/400/300',
    clockOutImage: 'https://picsum.photos/400/300',
  },
  {
    id: 8,
    user: USERS[2],
    store: STORES[2],
    date: getAttendanceDate(DateFilter.LAST_7_DAYS),
    clockIn: getClockInTime(new Date()),
    clockOut: getClockOutTime(new Date()),
    wagePerHour: 10,
    breaks: [
      {
        id: 8,
        attendanceId: 8,
        start: getBreakStart(new Date()),
        end: getBreakEnd(new Date()),
      },
    ],
    clockInImage: 'https://picsum.photos/400/300',
    clockOutImage: 'https://picsum.photos/400/300',
  },
  {
    id: 9,
    user: USERS[3],
    store: STORES[3],
    date: getAttendanceDate(DateFilter.LAST_7_DAYS),
    clockIn: getClockInTime(new Date()),
    clockOut: getClockOutTime(new Date()),
    wagePerHour: 10,
    breaks: [
      {
        id: 9,
        attendanceId: 9,
        start: getBreakStart(new Date()),
        end: getBreakEnd(new Date()),
      },
    ],
    clockInImage: 'https://picsum.photos/400/300',
    clockOutImage: 'https://picsum.photos/400/300',
  },
  {
    id: 10,
    user: USERS[4],
    store: STORES[4],
    date: getAttendanceDate(DateFilter.LAST_7_DAYS),
    clockIn: getClockInTime(new Date()),
    clockOut: getClockOutTime(new Date()),
    wagePerHour: 10,
    breaks: [
      {
        id: 10,
        attendanceId: 10,
        start: getBreakStart(new Date()),
        end: getBreakEnd(new Date()),
      },
    ],
    clockInImage: 'https://picsum.photos/400/300',
    clockOutImage: 'https://picsum.photos/400/300',
  },
  {
    id: 11,
    user: USERS[9],
    store: STORES[4],
    date: getAttendanceDate(DateFilter.LAST_7_DAYS),
    clockIn: getClockInTime(new Date()),
    clockOut: getClockOutTime(new Date()),
    wagePerHour: 10,
    breaks: [
      {
        id: 11,
        attendanceId: 11,
        start: getBreakStart(new Date()),
        end: getBreakEnd(new Date()),
      },
    ],
    clockInImage: 'https://picsum.photos/400/300',
    clockOutImage: 'https://picsum.photos/400/300',
  },
  {
    id: 12,
    user: USERS[2],
    store: STORES[4],
    date: getAttendanceDate(DateFilter.LAST_4_WEEKS),
    clockIn: getClockInTime(new Date()),
    clockOut: getClockOutTime(new Date()),
    wagePerHour: 9,
    breaks: [
      {
        id: 12,
        attendanceId: 12,
        start: getBreakStart(new Date()),
        end: getBreakEnd(new Date()),
      },
    ],
    clockInImage: 'https://picsum.photos/400/300',
    clockOutImage: 'https://picsum.photos/400/300',
  },
];
