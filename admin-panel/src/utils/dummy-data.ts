import { IFeedbackOverTime } from '../app/model/feedback';
import { DateFilter } from '../types/date-filter';
import { DateGroup } from '../types/date-group';
import { TimePeriod } from '../types/time-period';

export function generateDate(dateFilter: DateFilter): Date {
  const now = new Date();
  let startDate: Date;

  switch (dateFilter) {
    case DateFilter.TODAY:
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const timeDifference = now.getTime() - startOfToday.getTime();
      const randomOffset = Math.random() * timeDifference;
      return new Date(startOfToday.getTime() + randomOffset);
    case DateFilter.LAST_7_DAYS:
      startDate = new Date(now.setDate(now.getDate() - 6));
      startDate.setHours(0, 0, 0, 0);
      return new Date(startDate.getTime() + Math.random() * 6 * 86400000); // Random day within last 7 days
    case DateFilter.LAST_4_WEEKS:
      startDate = new Date(now.setDate(now.getDate() - 27));
      startDate.setHours(0, 0, 0, 0);
      return new Date(startDate.getTime() + Math.random() * 27 * 86400000); // Random day within last 4 weeks
    case DateFilter.LAST_12_MONTHS:
      startDate = new Date(now.setMonth(now.getMonth() - 12, now.getDate()));
      startDate.setHours(0, 0, 0, 0);
      return new Date(startDate.getTime() + Math.random() * 365 * 86400000); // Random day within last 12 months
    case DateFilter.MAX:
      startDate = new Date('1900-01-01T00:00:00');
      let range = now.getTime() - startDate.getTime();
      return new Date(startDate.getTime() + Math.random() * range); // Random date from 1900
    default:
      throw new Error('Invalid date filter');
  }
}

// [min, max)
export function getRandomNumber(
  min: number,
  max: number,
  step: number = 1
): number {
  const range = max - min;
  const stepsCount = Math.floor(range / step);
  const randomStep = Math.floor(Math.random() * stepsCount);
  return min + randomStep * step;
}

// [min, max)
export function getRandomFloat(min: number, max: number) {
  const randomPrice = (Math.random() * (max - min) + min).toFixed(2);
  return parseFloat(randomPrice);
}

export function getRandomItem<T>(list: T[]) {
  return list.at(getRandomNumber(0, list.length))!;
}

export function getRandomItems<T>(list: T[], n: number): T[] {
  if (n >= list.length) {
    return [...list]; // Return all items if n is greater than or equal to the length of the list
  }

  // Shuffling the list and getting the first n items
  const shuffledList = [...list].sort(() => Math.random() - 0.5);
  return shuffledList.slice(0, n);
}

export function getRandomEnumValue<T extends object>(
  enumObject: T
): T[keyof T] {
  const enumValues = Object.values(enumObject);
  return enumValues[getRandomNumber(0, enumValues.length)] as T[keyof T];
}

export function getRandomDate() {
  return generateDate(getRandomEnumValue(DateFilter));
}

export function getRandomBoolean(): boolean {
  return Math.random() >= 0.5;
}

export function getRandomDateInRange(start: Date, end: Date): Date {
  const open = start.getTime();
  const close = end.getTime();
  const randomTime = open + Math.random() * (close - open);
  return new Date(randomTime);
}
export function getRandomPercentage(min = 0, max = 1, step = 0.01) {
  // Calculate the number of possible values
  const range = Math.floor((max - min) / step) + 1;
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * range);
  // Calculate the random percentage based on the step and index
  return min + randomIndex * step;
}

export function getRandomTime() {
  const hours = getRandomNumber(0, 23);
  const minutes = getRandomNumber(0, 59, 30);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}`;
}

export function getRandomTimePeriod(): TimePeriod {
  return { opens: getRandomTime(), closes: getRandomTime() };
}

export function getRandomString(
  minLength: number = 10,
  maxLength: number = 100
): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function areDatesEqual(startDate: Date, endDate: Date): boolean {
  return (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()
  );
}

export function getDaysNameBetween(startDate?: Date, endDate?: Date): string[] {
  if (!startDate || !endDate) {
    return [];
  }
  const start = new Date(startDate);
  const end = new Date(endDate);

  let dateArray = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    dateArray.push(
      currentDate.toLocaleDateString('en-US', { weekday: 'long' })
    );
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  return dateArray;
}

export function groupFeedbackOverview(
  data: IFeedbackOverTime[],
  groupBy: DateGroup
): IFeedbackOverTime[] {
  const splitSize =
    groupBy === DateGroup.WEEK
      ? 7
      : groupBy === DateGroup.MONTH
      ? 30
      : groupBy === DateGroup.YEAR
      ? 365
      : 1;

  if (groupBy === DateGroup.NONE) {
    return data;
  }

  let slice = 0;

  const groupedData = data.reduce((acc: IFeedbackOverTime[], item, index) => {
    const groupIndex = Math.floor(index / splitSize);

    if (!acc[groupIndex]) {
      acc[groupIndex] = {
        ...item,
        groupedValues: { startDate: item.createdAt, endDate: item.createdAt },
      };
    } else {
      acc[groupIndex].createdAt = item.createdAt;
      acc[groupIndex].average = parseFloat(
        (
          (acc[groupIndex].average * (index % splitSize) + item.average) /
          ((index % splitSize) + 1)
        ).toFixed(2)
      );
      acc[groupIndex].total += item.total;
      acc[groupIndex].groupedValues!.endDate = item.createdAt;
    }

    return acc;
  }, []);

  return groupedData;
}

export function getRandomIdGenerator(
  min: number,
  max: number,
  attemptLimit: number = 100
): () => number {
  const previousIds: Set<number> = new Set();
  const generator = (): number => {
    let attempts = 0;
    while (attempts < attemptLimit) {
      const id = getRandomNumber(min, max);
      if (!previousIds.has(id)) {
        previousIds.add(id);
        return id;
      }
      attempts++;
    }
    throw new Error('Failed to generate a unique ID within the attempt limit');
  };
  return generator;
}
