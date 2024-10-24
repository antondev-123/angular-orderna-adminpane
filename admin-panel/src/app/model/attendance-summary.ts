export interface AttendanceSummary {
  id: number;
  userName: string;
  date: Date;
  breakHours: number;
  totalHours: number | string | undefined;
  hourlyPay: number;
  totalPay: number | string | undefined;
}
