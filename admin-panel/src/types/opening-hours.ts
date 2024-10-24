// Reference: https://schema.org/OpeningHoursSpecification
import { DayOfWeek } from './day-of-week';
import { TimePeriod } from './time-period';

type IsClosed = {
  isClosed: true;
};

type Is24Hours = {
  is24Hours: true;
};

export type OpeningHoursSpecification =
  | ({ daysOfWeek: DayOfWeek[] } & TimePeriod)
  | ({ daysOfWeek: DayOfWeek[] } & IsClosed)
  | ({ daysOfWeek: DayOfWeek[] } & Is24Hours);
