import { Unit, WithUnit } from './enum/unit-type';
import { Store } from './store';

export interface IInventoryItem extends WithUnit {
  id: number;
  title: string;
  sk_plu: string;
  storeId: Store;
  createdAt: Date;
  updatedAt: Date;
}

export const SUPPLIER_FIELDS: (keyof IInventoryItem)[] = [
  'id',
  'title',
  'sk_plu',
  'storeId',
  'unit',
  'createdAt',
  'updatedAt',
];

export type InventoryItemCreateData = Pick<
  IInventoryItem,
  'title' | 'sk_plu' | 'storeId' | 'unit'
>;
export type InventoryItemUpdateData = Pick<
  IInventoryItem,
  'title' | 'sk_plu' | 'storeId' | 'unit' | 'id'
>;

export class InventoryItem implements IInventoryItem {
  constructor(
    public readonly id = 0,
    public readonly title = '',
    public readonly sk_plu = '',
    public readonly storeId = new Store(),
    public readonly unit = Unit.GRAM,
    public readonly createdAt = new Date(),
    public readonly updatedAt = new Date()
  ) {}

  static fromJSON(json: IInventoryItem) {
    return new InventoryItem(
      json.id,
      json.title,
      json.sk_plu,
      json.storeId,
      json.unit,
      json.createdAt,
      json.updatedAt
    );
  }
}
