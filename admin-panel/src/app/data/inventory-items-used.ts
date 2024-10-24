import { getRandomItem, getRandomNumber } from '../../utils/dummy-data';
import { InventoryItem } from '../model/inventory';
import { InventoryItemUsed } from '../model/inventory-item-used';
import { INVENTORY_ITEMS } from './inventory';
import { PRODUCTS } from './products';
import { STORES } from './stores';

const inventoryItemUsedPerProductCount = 10;
let currentId = 1;
export const INVENTORY_ITEMS_USED = STORES.reduce(
  (acc: InventoryItemUsed[], store) => {
    for (const product of PRODUCTS) {
      // Generate n (min: 1, max: 5) random inventory items used per product
      // Reserve unused m (inventoryItemUsedPerProductCount - n) IDs
      // for user to create new inventoryItemsUsed dynamically in the UI
      const productInventoryItemUsedCount = getRandomNumber(1, 5);

      const storeInventoryItems = INVENTORY_ITEMS.filter(
        (o) => o.storeId.id === store.id
      );

      // Take note which inventory items have already been selected previously
      // to avoid duplicates
      const selectedInventoryItems: InventoryItem['id'][] = [];

      for (let i = 0; i < productInventoryItemUsedCount; i++) {
        const inventoryItem = getRandomItem(
          storeInventoryItems.filter(
            (o) => !selectedInventoryItems.includes(o.id)
          )
        );

        if (!inventoryItem) {
          console.error(
            `No inventory items left to choose from for product with ID ${product.id} and store with ID ${store.id}`
          );
        }

        selectedInventoryItems.push(inventoryItem.id);

        acc.push(
          InventoryItemUsed.fromJSON({
            id: currentId,
            createdAt: new Date(),
            updatedAt: new Date(),

            // NOTE: Currently all stores use the same products data
            // And we want to keep it that way, to avoid a large refactor
            // Problem is we will have duplicate product IDs here
            productId: product.id,
            // We need a way to differentiate the products of each store.
            // Found workaround by limiting inventoryItemUsed IDs of a product
            // to a certain range
            // e.g. Store 1's Product 1's inventoryItemUsed can only have IDs from 1-10.

            inventoryItemId: inventoryItem.id,
            quantity: getRandomNumber(1, 5),
            inventoryItem,
          })
        );
        currentId++;
      }
      currentId = store.id * product.id * inventoryItemUsedPerProductCount + 1;
    }
    return acc;
  },
  []
);
