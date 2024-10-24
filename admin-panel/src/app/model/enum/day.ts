export enum Days {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

export function getToday<T>(type: T, day: number): T[keyof T] {
  const casted = day as keyof T;
  return type[casted];
}
