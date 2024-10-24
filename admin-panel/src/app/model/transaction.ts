import { PaymentType } from '@orderna/admin-panel/src/app/model/enum/payment-type';
import { TransactionStatus } from '@orderna/admin-panel/src/app/model/enum/transaction-status';
import { Customer } from '@orderna/admin-panel/src/app/model/customer';
import { Store } from './store';
import { NIL as NIL_UUID } from 'uuid';
import { User } from './user';
import { TransactionType } from './enum/transaction-type';
import {
  TransactionItem,
  TransactionItemCreateData,
  TransactionItemUpdateData,
} from './transaction-item';
import { DiscountDetail } from './discount';
import {
  TRANSACTION_TYPE_DESCRIPTIONS,
  TRANSACTION_TYPE_ICONS,
  TRANSACTION_TYPE_LABELS,
} from '../../utils/constants/transaction-type';
import { PAYMENT_TYPE_LABELS } from '../../utils/constants/payment-type';

export interface ITransactionDerivedValues {
  salePrice: number;
  refundAmount: number;
  discountAmount: number;
  netSales: number;
  taxAmount: number;
  serviceAmount: number;
  grossSales: number;
}

export interface ITransaction extends ITransactionDerivedValues {
  id: string;
  transactionDate: Date;
  items: TransactionItem[];
  user: User;
  customer: Customer | null;
  total: number; // TODO: Check if can be removed. Seems to be similar to grossSales
  discount: DiscountDetail | null;
  salesTaxRate: number;
  serviceChargeRate: number | null;
  status: TransactionStatus;
  itemCount: number;
  store: Store;
  paymentType: PaymentType;
  note: string;
  transactionType: TransactionType;
  createdAt: Date;
  updatedAt: Date;

  // analytics
  revenue: number;
  tax: number;
  service: number;
  tip: number | null;
  refund: number;
  grossAmount: number;
  costOfGoods: number;
}

export type TransactionCreateData = Pick<
  ITransaction,
  | 'customer'
  | 'store'
  | 'user'
  | 'discount'
  | 'serviceChargeRate'
  | 'tip'
  | 'salesTaxRate'
  | 'paymentType'
  | 'status'
  | 'transactionType'
  | 'transactionDate'
  | 'note'
> & { items: TransactionItemCreateData[] };

export type TransactionUpdateData = Pick<ITransaction, 'id'> &
  Partial<
    Pick<
      ITransaction,
      | 'customer'
      | 'store'
      | 'user'
      | 'discount'
      | 'serviceChargeRate'
      | 'tip'
      | 'salesTaxRate'
      | 'paymentType'
      | 'status'
      | 'transactionType'
      | 'transactionDate'
      | 'note'
    >
  > & { items?: TransactionItemUpdateData[] };

export class Transaction implements ITransaction {
  constructor(
    public readonly id: ITransaction['id'] = NIL_UUID,
    public readonly transactionDate: ITransaction['transactionDate'] = new Date(),
    public readonly items: ITransaction['items'] = [],
    public readonly user: ITransaction['user'] = new User(),
    public readonly customer: ITransaction['customer'] = new Customer(),
    public readonly total: ITransaction['total'] = 0,
    public readonly revenue: ITransaction['revenue'] = 0,
    public readonly tax: ITransaction['tax'] = 0,
    public readonly service: ITransaction['service'] = 0,
    public readonly tip: ITransaction['tip'] = 0,
    public readonly refund: ITransaction['refund'] = 0,
    public readonly grossAmount: ITransaction['grossAmount'] = 0,
    public readonly costOfGoods: ITransaction['costOfGoods'] = 0,
    public readonly discount: ITransaction['discount'] = null,
    public readonly salesTaxRate: ITransaction['salesTaxRate'] = 0,
    public readonly serviceChargeRate: ITransaction['serviceChargeRate'] = 0,
    public readonly status: ITransaction['status'] = TransactionStatus.PENDING,
    public readonly itemCount: ITransaction['itemCount'] = 0,
    public readonly store: ITransaction['store'] = new Store(),
    public readonly paymentType: ITransaction['paymentType'] = PaymentType.CASH,
    public readonly note: ITransaction['note'] = '',
    public readonly transactionType: ITransaction['transactionType'] = TransactionType.IN_STORE,
    public readonly createdAt: ITransaction['createdAt'] = new Date(),
    public readonly updatedAt: ITransaction['updatedAt'] = new Date(),
    public readonly salePrice: ITransaction['salePrice'],
    public readonly refundAmount: ITransaction['refundAmount'],
    public readonly discountAmount: ITransaction['discountAmount'],
    public readonly netSales: ITransaction['netSales'],
    public readonly taxAmount: ITransaction['taxAmount'],
    public readonly serviceAmount: ITransaction['serviceAmount'],
    public readonly grossSales: ITransaction['grossSales']
  ) {}

  get salesTaxPercent() {
    return this.salesTaxRate * 100;
  }

  get serviceChargePercent() {
    return this.serviceChargeRate ? this.serviceChargeRate * 100 : null;
  }

  // TODO: Has same purpose as itemCount. Decide which to keep
  get quantity() {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  get transactionTypeLabel() {
    return TRANSACTION_TYPE_LABELS[this.transactionType] ?? 'Unknown';
  }

  get paymentTypeLabel() {
    return PAYMENT_TYPE_LABELS[this.paymentType] ?? 'Unknown';
  }

  get transactionTypeDescription() {
    return TRANSACTION_TYPE_DESCRIPTIONS[this.transactionType] ?? 'Unknown';
  }

  get transactionTypeIcon() {
    return TRANSACTION_TYPE_ICONS[this.transactionType] ?? null;
  }

  public static fromJSON(json: ITransaction) {
    return new Transaction(
      json.id,
      json.transactionDate,
      json.items,
      json.user,
      json.customer,
      json.total,
      json.revenue,
      json.tax,
      json.service,
      json.tip,
      json.refund,
      json.grossAmount,
      json.costOfGoods,
      json.discount,
      json.salesTaxRate,
      json.serviceChargeRate,
      json.status,
      json.itemCount,
      json.store,
      json.paymentType,
      json.note,
      json.transactionType,
      json.createdAt,
      json.updatedAt,
      json.salePrice,
      json.refundAmount,
      json.discountAmount,
      json.netSales,
      json.taxAmount,
      json.serviceAmount,
      json.grossSales
    );
  }
}
