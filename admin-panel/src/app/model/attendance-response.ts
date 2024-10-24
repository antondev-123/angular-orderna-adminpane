import { BreakDto } from './break';
import { Store } from './store';
import { User } from './user';

export interface AttendanceDto {
  id: number;
  store: Store;
  user: User;
  date: Date;
  clockIn: Date;
  clockInImage: string;
  clockOut?: Date;
  clockOutImage?: string;
  wagePerHour: number;
  breaks: BreakDto[];
  activeBreak?: Date;
}

export interface AttendanceResponse {
  filteredAttendances: AttendanceDto[];
  totalFiltered: number;
  totalAttendances: number;
}
