export interface IModifierOption {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  groupId: number;
  customPrice: number;

  title: string; // Is the product's name for now
}

export type ModifierOptionCreateData = Pick<
  IModifierOption,
  'productId' | 'customPrice'
>;

export type ModifierOptionUpdateData = Pick<IModifierOption, 'id'> &
  Partial<ModifierOptionCreateData>;

export class ModifierOption implements IModifierOption {
  constructor(
    public readonly id: IModifierOption['id'],
    public readonly createdAt: IModifierOption['createdAt'],
    public readonly updatedAt: IModifierOption['updatedAt'],
    public readonly groupId: IModifierOption['groupId'],
    public readonly productId: IModifierOption['productId'],
    public readonly customPrice: IModifierOption['customPrice'],
    public readonly title: IModifierOption['title']
  ) {}

  public static fromJSON(json: IModifierOption) {
    return new ModifierOption(
      json.id,
      json.createdAt,
      json.updatedAt,
      json.groupId,
      json.productId,
      json.customPrice,
      json.title
    );
  }
}
