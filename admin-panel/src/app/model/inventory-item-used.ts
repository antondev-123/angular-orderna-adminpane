import { InventoryItem as InventoryItem } from './inventory';
import { Product } from './product';

export interface IInventoryItemUsed {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  productId: Product['id'];
  inventoryItemId: InventoryItem['id'];
  quantity: number;
  inventoryItem: InventoryItem;
  unit?: string;
}

export type InventoryItemUsedCreateData = Pick<
  IInventoryItemUsed,
  'inventoryItemId' | 'quantity' | 'unit'
>;

export type InventoryItemUsedUpdateData = Partial<
  InventoryItemUsedCreateData & Pick<IInventoryItemUsed, 'id'>
>;

export class InventoryItemUsed implements IInventoryItemUsed {
  constructor(
    public readonly id: IInventoryItemUsed['id'],
    public readonly createdAt: IInventoryItemUsed['createdAt'],
    public readonly updatedAt: IInventoryItemUsed['updatedAt'],
    public readonly productId: IInventoryItemUsed['productId'],
    public readonly inventoryItemId: IInventoryItemUsed['inventoryItemId'],
    public readonly quantity: IInventoryItemUsed['quantity'],
    public readonly inventoryItem: IInventoryItemUsed['inventoryItem'],
    public readonly unit: IInventoryItemUsed['unit'],
  ) {}



  public static fromJSON(json: IInventoryItemUsed) {
    return new InventoryItemUsed(
      json.id,
      json.createdAt,
      json.updatedAt,
      json.productId,
      json.inventoryItemId,
      json.quantity,
      json.inventoryItem,
      json.unit
    );
  }
}
