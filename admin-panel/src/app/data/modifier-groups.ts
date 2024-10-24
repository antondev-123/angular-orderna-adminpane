import {
  getRandomBoolean,
  getRandomIdGenerator,
  getRandomNumber,
} from '../../utils/dummy-data';
import { ModifierGroup } from '../model/modifier-group';
import { PRODUCTS } from './products';

function getRandomCategoryIds(): ModifierGroup['categoryIds'] {
  const ids: ModifierGroup['categoryIds'] = [];
  const getRandomCategoryId = getRandomIdGenerator(1, 5); // Because categories generated in data/store.ts have IDs 1...5
  const categoryCount = getRandomNumber(1, 3);
  for (let i = 0; i < categoryCount; i++) {
    ids.push(getRandomCategoryId());
  }
  return ids;
}

export const getRandomModifierGroupId = getRandomIdGenerator(1, 5000);

export const MODIFIER_GROUPS = PRODUCTS.reduce(
  (acc: ModifierGroup[], product) => {
    const modifierGroupsPerProductCount = getRandomNumber(1, 5);
    for (let i = 0; i < modifierGroupsPerProductCount; i++) {
      const id = getRandomModifierGroupId();
      acc.push(
        ModifierGroup.fromJSON({
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
          productId: product.id,
          categoryIds: getRandomCategoryIds(),
          title: `Group ${id}`,
          skuPlu: getRandomBoolean() ? `G-${id}` : null,
          description: getRandomBoolean()
            ? `Description for group ${id}`
            : null,
          options: [],
          optionLimit: getRandomNumber(1, 5),
        })
      );
    }
    return acc;
  },
  []
);
