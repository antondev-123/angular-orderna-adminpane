import { Maybe, Maybeify } from '../../types/maybe';
import { CurrencyCode } from './enum/currency-code';
import { Unit, WithUnit } from './enum/unit-type';
import { InventoryItem } from './inventory';
import { Store } from './store';
import { Supplier } from './supplier';

export interface IPurchaseStatistics {
  currency: CurrencyCode;
}

export class PurchaseStatistics implements IPurchaseStatistics {
  constructor(public readonly currency = CurrencyCode.PHP) {}
}
export interface IPurchase extends WithUnit, Maybeify<IPurchaseStatistics> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  inventoryItemId: InventoryItem;
  storeId: Store;
  price: number;
  quantity: number;
  totalPrice: number;
  supplierId: Supplier;
  expirationDate: Date;
  purchaseDate: Date;
  note: string;
  unit: Unit;
}

export type PurchaseCreateData = Omit<
  IPurchase,
  'id' | 'createdAt' | 'updatedAt' | 'totalPrice'
>;
export type PurchaseUpdateData = Pick<IPurchase, 'id'> &
  Partial<Omit<IPurchase, 'id' | 'createdAt' | 'updatedAt' | 'totalPrice'>>;

export type PurchaseUpdateNote = Pick<IPurchase, 'id' | 'note'>;

export class Purchase implements IPurchase {
  constructor(
    public readonly id: number = 0,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly inventoryItemId: InventoryItem,
    public readonly storeId: Store,
    public readonly price: number = 0,
    public readonly quantity: number = 0,
    public readonly totalPrice: number = 0,
    public readonly supplierId: Supplier,
    public readonly expirationDate: Date = new Date(),
    public readonly note: string = '',
    public readonly unit: Unit,
    public readonly purchaseDate: Date = new Date(),
    public readonly currency: Maybe<CurrencyCode> = CurrencyCode.PHP
  ) {}

  static fromJSON(json: IPurchase) {
    return new Purchase(
      json.id,
      json.createdAt,
      json.updatedAt,
      json.inventoryItemId,
      json.storeId,
      json.price,
      json.quantity,
      json.totalPrice,
      json.supplierId,
      json.expirationDate,
      json.note,
      json.unit,
      json.purchaseDate,
      json.currency
    );
  }
}
