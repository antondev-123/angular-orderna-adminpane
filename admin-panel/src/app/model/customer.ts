import { Maybe, Maybeify } from '../../types/maybe';
import { IAddress } from './address';
import { CurrencyCode } from './enum/currency-code';

export interface ICustomerStatistics {
  totalTransactions: number;
  totalRefunds: number;
  totalAmountSpent: number;
  lastTransactionDate: Date | null;
  lastTransactionId: string | null;
  averageAmountSpentPerTransaction: number;
  currencyCode: CurrencyCode;
}

export class CustomerStatistics implements ICustomerStatistics {
  constructor(
    public readonly totalTransactions = 0,
    public readonly totalRefunds = 0,
    public readonly totalAmountSpent = 0,
    public readonly lastTransactionDate: Date | null = null,
    public readonly lastTransactionId: string | null = null,
    public readonly averageAmountSpentPerTransaction = 0,
    public readonly currencyCode = CurrencyCode.PHP
  ) {}
}

type ICustomerAddress = Maybeify<IAddress>;
export interface ICustomer extends ICustomerAddress, ICustomerStatistics {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  company: Maybe<string>;
  telephone: Maybe<string>;
  email: Maybe<string>;
  birthday: Maybe<Date>;
  note: Maybe<string>;
}

export type CustomerNameData = Pick<ICustomer, 'id' | 'firstName' | 'lastName'>;
export type CustomerCreateData = Omit<
  ICustomer,
  'id' | 'createdAt' | 'updatedAt'
>;
export type CustomerUpdateData = Pick<ICustomer, 'id'> &
  Partial<Omit<ICustomer, 'id' | 'createdAt' | 'updatedAt'>>;

export class Customer implements ICustomer {
  constructor(
    public readonly id: number = 0,
    public readonly firstName: string = '',
    public readonly lastName: string = '',
    public readonly company: Maybe<string> = null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly mobileNumber: string = '',
    public readonly telephone: Maybe<string> = null,
    public readonly email: Maybe<string> = null,
    public readonly birthday: Maybe<Date> = null,
    public readonly note: Maybe<string> = null,

    // customer address
    public readonly zipCode: Maybe<string> = null,
    public readonly city: Maybe<string> = null,
    public readonly street: Maybe<string> = null,

    // customer statistics
    public readonly totalTransactions: number = 0,
    public readonly totalRefunds: number = 0,
    public readonly totalAmountSpent: number = 0,
    public readonly lastTransactionDate: Date | null = null,
    public readonly lastTransactionId: string | null = '',
    public readonly averageAmountSpentPerTransaction: number = 0,
    public readonly currencyCode: CurrencyCode = CurrencyCode.PHP
  ) {}

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get address() {
    if (this.street && this.city && this.zipCode) {
      return `${this.street}, ${this.city}, ${this.zipCode}`;
    }
    return null;
  }

  static fromJSON(json: ICustomer) {
    return new Customer(
      json.id,
      json.firstName,
      json.lastName,
      json.company,
      json.createdAt,
      json.updatedAt,
      json.mobileNumber,
      json.telephone,
      json.email,
      json.birthday,
      json.note,
      json.zipCode,
      json.city,
      json.street,
      json.totalTransactions,
      json.totalRefunds,
      json.totalAmountSpent,
      json.lastTransactionDate,
      json.lastTransactionId,
      json.averageAmountSpentPerTransaction,
      json.currencyCode
    );
  }
}
