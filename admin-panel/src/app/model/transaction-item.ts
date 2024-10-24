import { DiscountDetail } from './discount';
import { Product } from './product';

export interface ITransactionItemDerivedValues {
  salePrice: number;
  refundAmount: number;
  discountAmount: number;
  netSales: number;
}

export interface TransactionItemEditableProps {
  productId: Product['id'];
  discountId: DiscountDetail['id'] | null;
  quantity: number;
  wasRefunded: boolean;
  note: string | null;
}

export interface TransactionItemUpdateData
  extends Partial<TransactionItemEditableProps> {
  id: string;
}

export interface TransactionItemCreateData
  extends TransactionItemEditableProps {}

export interface ITransactionItem
  extends TransactionItemCreateData,
    ITransactionItemDerivedValues {
  transactionId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
  discount: DiscountDetail | null;
}

export class TransactionItem implements ITransactionItem {
  constructor(
    public readonly id: ITransactionItem['id'] = '',
    public readonly createdAt: ITransactionItem['createdAt'] = new Date(),
    public readonly updatedAt: ITransactionItem['updatedAt'] = new Date(),
    public readonly transactionId: ITransactionItem['transactionId'] = '',
    public readonly quantity: ITransactionItem['quantity'] = 0,
    public readonly productId: ITransactionItem['productId'] = 0,
    public readonly discountId: ITransactionItem['discountId'] = null,
    public readonly wasRefunded: ITransactionItem['wasRefunded'] = false,
    public readonly note: ITransactionItem['note'] = null,
    public readonly product: ITransactionItem['product'] = new Product(),
    public readonly discount: ITransactionItem['discount'] = null,
    public readonly salePrice: ITransactionItem['salePrice'],
    public readonly refundAmount: ITransactionItem['refundAmount'],
    public readonly discountAmount: ITransactionItem['discountAmount'],
    public readonly netSales: ITransactionItem['netSales']
  ) {}

  get unitPrice() {
    return this.product.price;
  }

  public static fromJSON(json: ITransactionItem) {
    return new TransactionItem(
      json.id,
      json.createdAt,
      json.updatedAt,
      json.transactionId,
      json.quantity,
      json.productId,
      json.discountId,
      json.wasRefunded,
      json.note,
      json.product,
      json.discount,
      json.salePrice,
      json.refundAmount,
      json.discountAmount,
      json.netSales
    );
  }
}
