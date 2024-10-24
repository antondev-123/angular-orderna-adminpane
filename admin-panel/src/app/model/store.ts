import { WeekDay } from '../features/onboarding/components/store-opening-hours/weekdays';
import { Mobile } from '../shared/components/input/contact/mobile/mobile.interface';
import { Telephone } from '../shared/components/input/contact/telephone/telephone.interface';
import { ICategory } from './category';
import { CurrencyCode } from './enum/currency-code';
import { IProduct } from './product';

export type StoreNameData = Pick<IStore, 'id' | 'name'>;

export interface GetStoreResponseDto {
  data: {
    store: StoreNameData[];
  }
}

export interface IAddress {
  email: string;
  zipCode: string;
  city: string;
  streetAddress: string;
}

export type IStoreAddress = IAddress & { buildingNumber: string };

export interface ITime {
  selectedHours: string;
  selectedMins: string;
}

export interface ITimeSlot {
  open: ITime;
  close: ITime;
}

export interface IOpeningHours {
  timeSlots: ITimeSlot[];
  isClosed: boolean;
  is24Hours: boolean;
}

export type WeeklyOpeningHours = {
  [key in WeekDay]: IOpeningHours;
};

export interface DayData {
  timeSlots: ITimeSlot[];
  isClosed: boolean;
  is24Hours: boolean;
}

export interface StoreCreateData extends IStoreAddress {
  name: string;
  email: string;
  mobile: Mobile;
  telephone?: Telephone;
  website?: string;
  about: string;
  currency: CurrencyCode;
  VATNumber: string;
  openingHours?: WeeklyOpeningHours;
  isOpen: boolean;
}

export interface IStore extends StoreCreateData {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  openingHours: WeeklyOpeningHours;
  categoryCount: number;
  productCount: number;
  itemImagesCount: number;
  itemDescriptionCount: number;
  categories: ICategory[];
}

export class Store implements IStore {
  constructor(
    public readonly id: number = 0,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly name: string = '',
    public readonly email: string = '',
    public readonly mobile: Mobile = { countryCode: '', number: '' },
    public readonly about: string = '',
    public readonly currency: CurrencyCode = CurrencyCode.PHP,
    public readonly VATNumber: string = '',
    public readonly buildingNumber: string = '',
    public readonly city: string = '',
    public readonly streetAddress: string = '',
    public readonly zipCode: string = '',
    public readonly openingHours: WeeklyOpeningHours = {} as WeeklyOpeningHours,
    public readonly categoryCount: number = 0,
    public readonly productCount: number = 0,
    public readonly itemImagesCount: number = 0,
    public readonly itemDescriptionCount: number = 0,
    public readonly categories: ICategory[] = [],
    public readonly isOpen: boolean = false, // TODO: Check if needed
    public readonly telephone?: Telephone,
    public readonly website?: string,
  ) {}

  // TODO: Remove. Don't imply from store name. Assume API provides this.
  get slug() {
    return this.name.replace(/ /g, '-').toLowerCase();
  }

  get address() {
    if (!this.streetAddress || !this.city || !this.zipCode) return null;

    const addressParts = [this.streetAddress, this.city, this.zipCode];
    if (this.buildingNumber) {
      addressParts.unshift(this.buildingNumber);
    }
    return addressParts.join(', ');
  }

  static fromJSON(json: IStore) {
    return new Store(
      json.id,
      json.createdAt,
      json.updatedAt,
      json.name,
      json.email,
      json.mobile,
      json.about,
      json.currency,
      json.VATNumber,
      json.buildingNumber,
      json.city,
      json.streetAddress,
      json.zipCode,
      json.openingHours,
      json.categoryCount,
      json.productCount,
      json.itemImagesCount,
      json.itemDescriptionCount,
      json.categories,
      json.isOpen, // TODO: Check if needed
      json.telephone,
      json.website
    );
  }
}

// Interfaces used for stores/<slug>/shop page

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IOrderSummary {
  items: ICartItem[];
  totalAmount: number;
}

export interface ICheckoutDetails {
  shippingAddress: IAddress;
  paymentMethod: string;
  items: ICartItem[];
}

export interface IOrderStatus {
  orderId: number;
  status: string; // e.g., 'Pending', 'Shipped', 'Delivered'
  estimatedDelivery: Date;
}

// Interface used for store dashboard summary
export enum IStoreDashboardSummaryType {
  TOTAL_TRANSACTIONS = 'Total Transactions',
  AVERAGE_ORDER_VALUE = 'Avg.order value',
  REVENUE = 'Revenue',
  TOTAL_DISCOUNTS = 'Total Discounts',
  COST_OF_GOODS = 'Cost of Goods',
  GROSS_PROFIT = 'Gross Profit',
}
export interface IStoreDashboardSummary {
  title: IStoreDashboardSummaryType;
  value: number;
  valueIsCurrency?: boolean;
  percent: number;
  from: number;
}

export interface IStoreDashboardComparison {
  storeName: string;
  gross: number;
  expense: number;
  net: number;
}
