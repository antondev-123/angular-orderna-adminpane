import { DayOfWeek } from '../../types/day-of-week';
import { TimePeriod } from '../../types/time-period';
import { CurrencyCode } from './enum/currency-code';
import { DiscountStatus } from './enum/discount-status';
import { DiscountType } from './enum/discount-type';
import { IStore } from './store';

export type DiscountTotalRedeemedAmountOverTimeChartData = {
  period: Date;
  totalRedeemedAmount: number;
}[];

/**
 * Interface representing discount statistics.
 * @interface IDiscountStatistics
 */
export interface IDiscountStatistics {
  /** Number of times the discount code was used. */
  numberOfRedemptions: number;

  /** Total amount redeemed or saved by customers using the discount. */
  totalRedeemedAmount: number;

  /** Average order amount where the discount was applied. */
  averageOrderAmount: number;

  /** Total revenue earned from orders that used the discount code. */
  totalRevenue: number;

  currencyCode: CurrencyCode.PHP;
}

/**
 * Class representing discount statistics.
 * @implements {IDiscountStatistics}
 */
export class DiscountStatistics implements IDiscountStatistics {
  /**
   * Creates an instance of DiscountStatistics.
   * @param {number} [numberOfRedemptions=0] - Number of times the discount code was used.
   * @param {number} [totalRedeemedAmount=0] - Total amount redeemed or saved by customers using the discount.
   * @param {number} [averageOrderAmount=0] - Average order amount where the discount was applied.
   * @param {number} [totalRevenue=0] - Total revenue earned from orders that used the discount code.
   */
  constructor(
    public readonly numberOfRedemptions: number = 0,
    public readonly totalRedeemedAmount: number = 0,
    public readonly averageOrderAmount: number = 0,
    public readonly totalRevenue: number = 0,
    public readonly currencyCode: CurrencyCode.PHP = CurrencyCode.PHP
  ) {}
}

export interface IDiscountSummary {
  id: number;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  type: DiscountType;
  formattedValue: number;
  status: DiscountStatus;
  redemptionsCount: number;
  currencyCode: CurrencyCode; // relevant only if DiscountType is FIXED
}

export interface IDiscountDetail extends IDiscountSummary {
  description: string;
  applicableStores: IStore['id'][];
  isArchived: boolean;
  validFrom: Date | null; // null means discount will be valid from createdAt
  validThrough: Date | null; // null means discount will be valid indefinitely
  daysAvailable: DayOfWeek[];
  isAvailableAllDay: boolean;
  hoursAvailable: TimePeriod | null; // relevant only if isAvailableAllDay is false
  minimumSpend: number;
  redemptionLimit: number;
  redemptionLimitPerCustomer: number;
}

export interface IDiscountCreateData {
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  currencyCode?: CurrencyCode; // relevant only if DiscountType is FIXED
  applicableStores: IStore['id'][];
  validFrom?: Date;
  validThrough?: Date;
  daysAvailable?: DayOfWeek[];
  isAvailableAllDay: boolean;
  hoursAvailable?: TimePeriod;
  minimumSpend?: number;
  redemptionLimit?: number;
  redemptionLimitPerCustomer?: number;
}

export type IDiscountUpdateData = Omit<IDiscountCreateData, 'code'> &
  Pick<IDiscountDetail, 'id' | 'isArchived'>;

export class DiscountSummary implements IDiscountSummary {
  constructor(
    public readonly id: number = 0,
    public readonly code: string = '',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly type: DiscountType = DiscountType.PERCENTAGE,
    public readonly formattedValue: number = 0,
    public readonly status: DiscountStatus = DiscountStatus.ACTIVE,
    public readonly redemptionsCount: number = 0,
    public readonly currencyCode: CurrencyCode = CurrencyCode.PHP
  ) {}

  static fromJSON(json: any) {
    return new DiscountSummary(
      json.id,
      json.code,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.type,
      +json.value,
      json.status,
      +json.redemptionsCount,
      json.currencyCode
    );
  }
}

export class DiscountDetail implements IDiscountDetail {
  constructor(
    public readonly id: number = 0,
    public readonly code: string = '',
    public readonly description: string = '',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly type: DiscountType = DiscountType.PERCENTAGE,
    public readonly value: number = 0,
    public readonly currencyCode: CurrencyCode = CurrencyCode.PHP, // relevant only if DiscountType is FIXED
    public readonly applicableStores: IStore['id'][] = [],
    public readonly isArchived: boolean = false,
    public readonly validFrom: Date | null = null, // null means discount will be valid from createdAt
    public readonly validThrough: Date | null = null, // null means discount will be valid indefinitely
    public readonly daysAvailable: DayOfWeek[] = [],
    public readonly isAvailableAllDay: boolean = true,
    public readonly hoursAvailable: TimePeriod | null = null, // relevant only if isAvailableAllDay is false
    public readonly minimumSpend: number = 0,
    public readonly redemptionLimit: number = 0,
    public readonly redemptionLimitPerCustomer: number = 0,
    public readonly status: DiscountStatus = DiscountStatus.ACTIVE,
    public readonly redemptionsCount: number = 0
  ) {}

  get formattedValue() {
    return this.type === DiscountType.PERCENTAGE
      ? this.value * 100
      : this.value;
  }

  static fromJSON(json: any) {
    return new DiscountDetail(
      json.id,
      json.code,
      json.description,
      json.createdAt,
      json.updatedAt,
      json.type,
      json.value,
      json.currencyCode, // relevant only if DiscountType is FIXED
      json.applicableStores,
      json.isArchived,
      json.validFrom, // null means discount will be valid from createdAt
      json.validThrough, // null means discount will be valid indefinitely
      json.daysAvailable,
      json.isAvailableAllDay,
      json.hoursAvailable, // relevant only if isAvailableAllDay is false
      json.minimumSpend,
      json.redemptionLimit,
      json.redemptionLimitPerCustomer,
      json.status,
      json.redemptionsCount
    );
  }
}
