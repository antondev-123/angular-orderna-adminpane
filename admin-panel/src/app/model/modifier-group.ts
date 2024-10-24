import {
  ModifierOption,
  ModifierOptionCreateData,
  ModifierOptionUpdateData,
} from './modifier-option';
import { Product } from './product';

export interface IModifierGroup {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  productId: Product['id'];
  // NOTE: Used number instead of Category here because Category['id'] can be undefined
  //       which we don't want here
  categoryIds: number[]; // Limit modifier options to only the products in these categories
  title: string;
  skuPlu: string | null;
  description: string | null;
  options: ModifierOption[];
  optionLimit: number;
}

export type ModifierGroupCreateData = Pick<
  IModifierGroup,
  | 'productId'
  | 'title'
  | 'skuPlu'
  | 'description'
  | 'optionLimit'
  | 'categoryIds'
> & { options: ModifierOptionCreateData[] };

export type ModifierGroupUpdateData = Pick<IModifierGroup, 'id'> &
  Partial<Omit<ModifierGroupCreateData, 'options'>> & {
    options?: ModifierOptionUpdateData[];
  };

export class ModifierGroup implements IModifierGroup {
  constructor(
    public readonly id: IModifierGroup['id'],
    public readonly createdAt: IModifierGroup['createdAt'],
    public readonly updatedAt: IModifierGroup['updatedAt'],
    public readonly productId: IModifierGroup['productId'],
    public readonly categoryIds: IModifierGroup['categoryIds'],
    public readonly title: IModifierGroup['title'],
    public readonly skuPlu: IModifierGroup['skuPlu'],
    public readonly description: IModifierGroup['description'],
    public readonly options: IModifierGroup['options'],
    public readonly optionLimit: IModifierGroup['optionLimit']
  ) {}

  public static fromJSON(json: IModifierGroup) {
    return new ModifierGroup(
      json.id,
      json.createdAt,
      json.updatedAt,
      json.productId,
      json.categoryIds,
      json.title,
      json.skuPlu,
      json.description,
      json.options,
      json.optionLimit
    );
  }
}
