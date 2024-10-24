import {
  getRandomFloat,
  getRandomIdGenerator,
  getRandomItems,
  getRandomNumber,
} from '../../utils/dummy-data';
import { ModifierOption } from '../model/modifier-option';
import { MODIFIER_GROUPS } from './modifier-groups';

export const getRandomModifierOptionId = getRandomIdGenerator(1, 5000);

export const MODIFIER_OPTIONS = MODIFIER_GROUPS.reduce(
  (acc: ModifierOption[], group) => {
    const productCategoryIds = group.categoryIds;

    // NOTE: In data/stores.ts, each category has 2 products
    const maxModifierOptionsPerProduct = productCategoryIds.length * 2;
    const modifierOptionsPerProductCount = getRandomNumber(
      1,
      maxModifierOptionsPerProduct
    );

    // NOTE: In data/products.ts, products have ids from 1..10
    // So randomly select an id from that range
    // But it should be filtered by the current modifier group's categories
    // And current product shouldn't be included in the options
    const validProductIds = Array.from({ length: 10 }, (_, i) => i + 1).filter(
      (j) =>
        j !== group.productId && productCategoryIds.includes(((j - 1) % 5) + 1)
    );

    const productIds = getRandomItems(
      validProductIds,
      modifierOptionsPerProductCount
    );

    for (const productId of productIds) {
      acc.push(
        ModifierOption.fromJSON({
          id: getRandomModifierOptionId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          productId,
          groupId: group.id,
          customPrice: getRandomFloat(100, 300),

          title: '',
        })
      );
    }
    return acc;
  },
  []
);
