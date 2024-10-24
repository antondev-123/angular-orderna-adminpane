import { Maybe, Maybeify } from '../../types/maybe';
import { IAddress } from './address';
import { PaymentType, WithPaymentType } from './enum/payment-type';
import { Status, WithStatus } from './enum/status';

type ISupplierAddress = Maybeify<IAddress>;
export interface ISupplier
  extends ISupplierAddress,
    WithStatus,
    WithPaymentType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  orders: number;
  lastOrder: string;
  toatlSpend: number;
  refunds: number;
  store: string;
  createdAt: Date;
  updatedAt: Date;
  note: string;
  mobileNumber: string;
  telephoneNumber: string;
  company: string;
}

export const SUPPLIER_FIELDS: (keyof ISupplier)[] = [
  'id',
  'firstName',
  'lastName',
  'email',
  'orders',
  'lastOrder',
  'toatlSpend',
  'refunds',
  'store',
  'createdAt',
  'updatedAt',
  'note',
  'mobileNumber',
  'telephoneNumber',
  'company',
];

export type SupplierCreateData = Pick<
  ISupplier,
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'zipCode'
  | 'city'
  | 'street'
  | 'note'
  | 'mobileNumber'
  | 'telephoneNumber'
  | 'company'
>;
export type SupplierUpdateData = Pick<
  ISupplier,
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'zipCode'
  | 'city'
  | 'street'
  | 'id'
  | 'mobileNumber'
  | 'telephoneNumber'
  | 'company'
  | 'note'
>;

export type SupplierUpdateNote = Pick<ISupplier, 'id' | 'note'>;

export class Supplier implements ISupplier {
  constructor(
    public readonly id = 0,
    public readonly firstName = '',
    public readonly lastName = '',
    public readonly email = '',
    public readonly orders = 0,
    public readonly lastOrder = '',
    public readonly toatlSpend = 0,
    public readonly refunds = 0,
    public readonly createdAt = new Date(),
    public readonly updatedAt = new Date(),
    public readonly zipCode: Maybe<string> = null,
    public readonly city: Maybe<string> = null,
    public readonly street: Maybe<string> = null,
    public readonly store: string = '',
    public readonly note: string = '',
    public readonly status = Status.ACTIVE,
    public readonly paymentType = PaymentType.CASH,
    public readonly mobileNumber: string = '',
    public readonly telephoneNumber: string = '',
    public readonly company: string = ''
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

  static fromJSON(json: ISupplier) {
    return new Supplier(
      json.id,
      json.firstName,
      json.lastName,
      json.email,
      json.orders,
      json.lastOrder,
      json.toatlSpend,
      json.refunds,
      json.createdAt,
      json.updatedAt,
      json.zipCode,
      json.city,
      json.street,
      json.store,
      json.note,
      json.status,
      json.paymentType,
      json.mobileNumber,
      json.telephoneNumber,
      json.company
    );
  }
}
