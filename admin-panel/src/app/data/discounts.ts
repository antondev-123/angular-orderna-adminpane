import { DayOfWeek } from '../../types/day-of-week';
import { generateRandomDiscountCode as getRandomDiscountCode } from '../../utils/discount-code-generator';
import {
  getRandomBoolean,
  getRandomDate,
  getRandomDateInRange,
  getRandomEnumValue,
  getRandomItems,
  getRandomNumber,
  getRandomPercentage,
  getRandomTimePeriod,
} from '../../utils/dummy-data';
import { DiscountDetail, DiscountSummary } from '../model/discount';
import { CurrencyCode } from '../model/enum/currency-code';
import { DiscountStatus } from '../model/enum/discount-status';
import { DiscountType } from '../model/enum/discount-type';
import { STORES } from './stores';

function getRandomDiscountDescription(
  type: DiscountType,
  rawValue: number
): string {
  const value = type === DiscountType.PERCENTAGE ? rawValue * 100 : rawValue;

  const percentageDescriptions = [
    `Enjoy ${value}% off your next meal!`,
    `Get ${value}% off during our happy hour!`,
    `Special offer: ${value}% off for new customers!`,
    `Limited time only: ${value}% off your total bill!`,
    `Exclusive offer: ${value}% off for loyalty members!`,
    `Holiday discount: ${value}% off all items!`,
  ];

  const fixedAmountDescriptions = [
    `Save PHP ${value} on orders above PHP 500!`,
    `Weekend special: Save PHP ${value} on your order!`,
    `Get PHP ${value} off during our special promotion!`,
    `Limited time offer: Save PHP ${value} on your total bill!`,
    `Exclusive deal: Get PHP ${value} off for loyalty members!`,
    `Holiday special: Save PHP ${value} on all items!`,
  ];

  const descriptions =
    type === DiscountType.PERCENTAGE
      ? percentageDescriptions
      : fixedAmountDescriptions;
  const randomIndex = Math.floor(Math.random() * descriptions.length);
  return descriptions[randomIndex];
}

function getRandomMinimumSpend(type: DiscountType, value: number): number {
  if (type === DiscountType.PERCENTAGE) {
    if (value <= 10) {
      return 300;
    } else if (value <= 20) {
      return 500;
    } else if (value <= 30) {
      return 1000;
    } else {
      return 1500;
    }
  } else if (type === DiscountType.FIXED) {
    if (value <= 50) {
      return 300;
    } else if (value <= 100) {
      return 500;
    } else if (value <= 200) {
      return 800;
    } else {
      return 1500;
    }
  }
  return 0; // Fallback in case of an unexpected type or value
}

function getRandomDiscountDates(): {
  startDate: Date | null;
  endDate: Date | null;
} {
  const currentDate = new Date();
  const pastDateRange = 30; // 30 days in the past
  const futureDateRange = 30; // 30 days in the future

  // Generate a random boolean to decide if the date range falls in the
  // - past,
  // - present,
  // - future,
  // - from creationDate onwards,
  // - from creationDate to X days from now,
  // - from day X onwards,
  const dateType = Math.floor(Math.random() * 6);

  let startDate: Date | null;
  let endDate: Date | null;

  if (dateType === 0) {
    // Past dates
    const pastEndDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const pastStartDate = new Date(
      currentDate.getTime() - pastDateRange * 24 * 60 * 60 * 1000
    );
    startDate = getRandomDateInRange(pastStartDate, pastEndDate);
    endDate = getRandomDateInRange(startDate, pastEndDate);
  } else if (dateType === 1) {
    // Current dates
    const pastStartDate = new Date(
      currentDate.getTime() - pastDateRange * 24 * 60 * 60 * 1000
    );
    const futureEndDate = new Date(
      currentDate.getTime() + futureDateRange * 24 * 60 * 60 * 1000
    );
    startDate = getRandomDateInRange(pastStartDate, currentDate);
    endDate = getRandomDateInRange(currentDate, futureEndDate);
  } else if (dateType === 2) {
    // Future dates
    const futureStartDate = new Date(
      currentDate.getTime() + 24 * 60 * 60 * 1000
    );
    const futureEndDate = new Date(
      currentDate.getTime() + futureDateRange * 24 * 60 * 60 * 1000
    );
    startDate = getRandomDateInRange(futureStartDate, futureEndDate);
    endDate = getRandomDateInRange(startDate, futureEndDate);
  } else if (dateType === 3) {
    // From creationDate onwards
    startDate = null;
    endDate = null;
  } else if (dateType === 4) {
    // From creationDate to X days from now
    const futureEndDate = new Date(
      currentDate.getTime() + futureDateRange * 24 * 60 * 60 * 1000
    );
    startDate = null;
    endDate = getRandomDateInRange(new Date(), futureEndDate);
  } else {
    // From day X onwards
    const pastStartDate = new Date(
      currentDate.getTime() - pastDateRange * 24 * 60 * 60 * 1000
    );
    const futureEndDate = new Date(
      currentDate.getTime() + futureDateRange * 24 * 60 * 60 * 1000
    );
    startDate = getRandomDateInRange(pastStartDate, futureEndDate);
    endDate = null;
  }

  return { startDate, endDate };
}

function getRandomDaysAvailable() {
  // Convert DayOfWeek object to an array of days
  const days = Object.values(DayOfWeek).filter(
    (d) => d !== DayOfWeek.PUBLIC_HOLIDAYS
  );

  // Shuffle the array using Fisher-Yates shuffle
  for (let i = days.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [days[i], days[j]] = [days[j], days[i]]; // swap elements
  }

  // Return a random number of days, at least one
  const count = Math.floor(Math.random() * days.length) + 1;
  return days.slice(0, count);
}

function getDiscountStatus(validFrom: Date, validThrough: Date | null) {
  const now = new Date();

  // Check if the current date falls within the valid range
  if (now >= validFrom && (validThrough === null || now <= validThrough)) {
    return DiscountStatus.ACTIVE;
  }

  // Check if the valid range is in the future
  if (now < validFrom) {
    return DiscountStatus.SCHEDULED;
  }

  // Check if the valid range is in the past
  if (validThrough !== null && now > validThrough) {
    return DiscountStatus.EXPIRED;
  }

  // If validThrough is null, it implies an open-ended period, so no expiration
  return DiscountStatus.ACTIVE;
}

export const DISCOUNTS = Array.from({ length: 5 }, (_, index) => {
  const code = getRandomDiscountCode();
  const atDate = getRandomDate();
  const type = getRandomEnumValue(DiscountType);
  const value =
    type === DiscountType.PERCENTAGE
      ? getRandomPercentage(0.1, 0.5, 0.1)
      : getRandomNumber(50, 500, 50);
  const description = getRandomDiscountDescription(type, value);
  const applicableStores = getRandomItems(
    STORES.map((s) => s.id),
    getRandomNumber(1, 5)
  );
  const isArchived = getRandomBoolean();
  const isAvailableAllDay = getRandomBoolean();
  const { startDate: validFrom, endDate: validThrough } =
    getRandomDiscountDates();
  const daysAvailable = getRandomDaysAvailable();
  const hoursAvailable = isAvailableAllDay ? null : getRandomTimePeriod();
  const minimumSpend = getRandomMinimumSpend(type, value);
  const redemptionLimit = getRandomNumber(0, 500, 10);
  const redemptionLimitPerCustomer = getRandomNumber(
    redemptionLimit > 0 ? 1 : 0,
    10,
    2
  );
  const status = isArchived
    ? DiscountStatus.ARCHIVED
    : getDiscountStatus(validFrom ?? atDate, validThrough);
  const currencyCode = CurrencyCode.PHP;

  return DiscountDetail.fromJSON({
    id: index + 1,
    description,
    code,
    createdAt: atDate,
    updatedAt: atDate,
    applicableStores,
    type,
    value,
    isAvailableAllDay,
    isArchived,
    validFrom,
    validThrough,
    daysAvailable,
    hoursAvailable,
    minimumSpend,
    redemptionLimit,
    redemptionLimitPerCustomer,
    status,

    // TODO: get date from transaction dummy data
    redemptionsCount: getRandomNumber(0, 50),

    currencyCode,
  });
});
