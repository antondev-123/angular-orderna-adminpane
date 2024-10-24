import { WeeklyOpeningHours } from "@orderna/admin-panel/src/app/model/store";

export enum WeekDay {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export const WEEKLY = [WeekDay.MONDAY, WeekDay.TUESDAY, WeekDay.WEDNESDAY, WeekDay.THURSDAY, WeekDay.FRIDAY, WeekDay.SATURDAY, WeekDay.SUNDAY];

export const WEEKLY_OPENING_HOURS: WeeklyOpeningHours = {
  [WeekDay.MONDAY]: {
    timeSlots: [
      {
        open: { selectedHours: '09', selectedMins: '00' },
        close: { selectedHours: '12', selectedMins: '00' },
      },
    ],
    isClosed: false,
    is24Hours: true,
  },
  [WeekDay.TUESDAY]: {
    timeSlots: [
      {
        open: { selectedHours: '09', selectedMins: '00' },
        close: { selectedHours: '12', selectedMins: '00' },
      },
    ],
    isClosed: false,
    is24Hours: true,
  },
  [WeekDay.WEDNESDAY]: {
    timeSlots: [
      {
        open: { selectedHours: '09', selectedMins: '00' },
        close: { selectedHours: '12', selectedMins: '00' },
      },
    ],
    isClosed: false,
    is24Hours: true,
  },
  [WeekDay.THURSDAY]: {
    timeSlots: [
      {
        open: { selectedHours: '09', selectedMins: '00' },
        close: { selectedHours: '12', selectedMins: '00' },
      },
    ],
    isClosed: false,
    is24Hours: true,
  },
  [WeekDay.FRIDAY]: {
    timeSlots: [
      {
        open: { selectedHours: '09', selectedMins: '00' },
        close: { selectedHours: '12', selectedMins: '00' },
      },
    ],
    isClosed: false,
    is24Hours: true,
  },
  [WeekDay.SATURDAY]: {
    timeSlots: [
      {
        open: { selectedHours: '09', selectedMins: '00' },
        close: { selectedHours: '12', selectedMins: '00' },
      },
    ],
    isClosed: false,
    is24Hours: true,
  },
  [WeekDay.SUNDAY]: {
    timeSlots: [
      {
        open: { selectedHours: '09', selectedMins: '00' },
        close: { selectedHours: '12', selectedMins: '00' },
      },
    ],
    isClosed: false,
    is24Hours: true,
  },
};

export function convertOpeningHours(weeklyOpeningHours: any): WeeklyOpeningHours {
  return WEEKLY.reduce((acc, day) => {
    const dayData = { ...weeklyOpeningHours[day] };
    acc[day] = {
      timeSlots: dayData.timeSlots.map(({ open, close }: any) => ({
        open: `${open.selectedHours}:${open.selectedMins}`,
        close: `${close.selectedHours}:${close.selectedMins}`
      })),
      isClosed: dayData.isClosed,
      is24Hours: dayData.is24Hours,
    };
    return acc;
  }, {} as WeeklyOpeningHours);
}
