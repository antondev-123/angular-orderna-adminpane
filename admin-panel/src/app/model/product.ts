import { ModifierGroup } from './modifier-group';
import {
  InventoryItemUsedCreateData,
  InventoryItemUsed,
  InventoryItemUsedUpdateData,
} from './inventory-item-used';

export interface IProduct {
  productId?: number;
  id: number;
  title: string;
  description: string;
  sk_plu: string;
  unit: string;
  stock: number;
  cost: number;
  price: number;
  category: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  modifiersCount: number;
  modifiers: ModifierGroup[];
  inventoryItems: InventoryItemUsed[];
  total_record: number;
  categoryCount: number;
}

export class Product implements IProduct {
  id: number;
  title: string;
  description: string;
  sk_plu: string;
  unit: string;
  stock: number;
  cost: number;
  price: number;
  category: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | undefined;
  modifiersCount: number;
  modifiers: ModifierGroup[];
  inventoryItems: InventoryItemUsed[];
  inventory?: InventoryItemUsed[];
  total_record: number;
  categoryCount: number;
  storeId?:number;
  productId?:number

  constructor(
    id = 0,
    title = '',
    description = '',
    sk_plu = '',
    unit = '',
    stock = 0,
    cost = 0,
    price = 0,
    category = 0,
    status = false,
    createdAt = new Date(),
    updatedAt = new Date(),
    image = '',
    modifiersCount = 0,
    modifiers: ModifierGroup[] = [],
    rawMaterials: InventoryItemUsed[] = [],
    total_record: number = 0,
    categoryCount: number = 0,
    productId:number = 0,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.sk_plu = sk_plu;
    this.unit = unit;
    this.stock = stock;
    this.cost = cost;
    this.price = price;
    this.category = category;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.image = image;
    this.modifiersCount = modifiersCount;
    this.modifiers = modifiers;
    this.inventoryItems = rawMaterials;
    this.total_record = total_record;
    this.categoryCount = categoryCount;
    this.productId = productId
  }

  get soldOut() {
    return this.stock === 0;
  }

  static fromJSON(json: IProduct) {
    return new Product(
      json.id,
      json.title,
      json.description,
      json.sk_plu,
      json.unit,
      json.stock,
      json.cost,
      json.price,
      json.category,
      json.status,
      json.createdAt,
      json.updatedAt,
      json.image,
      json.modifiersCount,
      json.modifiers,
      json.inventoryItems,
      json.total_record,
      json.categoryCount,
      json.productId
    );
  }
}

export type ProductUpdateData = Pick<
  IProduct,
  | 'id'
  | 'title'
  | 'description'
  | 'sk_plu'
  | 'unit'
  | 'stock'
  | 'cost'
  | 'price'
  | 'category'
  | 'status'
  | 'image'
> & { inventoryItems: InventoryItemUsedUpdateData[] };

export type ProductCreateData = Pick<
  IProduct,
  | 'title'
  | 'description'
  | 'sk_plu'
  | 'unit'
  | 'stock'
  | 'cost'
  | 'price'
  | 'category'
  | 'status'
  | 'image'
  > & { inventoryItems: InventoryItemUsedUpdateData[] };

export interface ITopSoldProduct {
  id: number;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

export type ITopSoldProductKeys = keyof ITopSoldProduct;

export interface ITotalSales {
  id: number;
  productName: string;
  totalSold: number;
  date: Date;
}
