import { getRandomEnumValue, getRandomNumber } from '../../utils/dummy-data';
import { Unit } from '../model/enum/unit-type';
import { InventoryItem as InventoryItem } from '../model/inventory';
import { STORES } from './stores';

let currentId = 0;
export const INVENTORY_ITEMS = STORES.reduce((acc: InventoryItem[], storeId) => {
  const inventoryItemsCountPerStore = getRandomNumber(5, 20);

  for (let i = 0; i < inventoryItemsCountPerStore; i++) {
    const id = ++currentId;
    acc.push(
      InventoryItem.fromJSON({
        id,
        title: `Inventory Item ${id}`,
        sk_plu: `II-${id}`,
        storeId,
        unit: getRandomEnumValue(Unit),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  }
  return acc;
}, []);
