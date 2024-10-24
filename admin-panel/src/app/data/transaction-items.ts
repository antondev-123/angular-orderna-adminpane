import {
  getRandomBoolean,
  getRandomItem,
  getRandomNumber,
} from '../../utils/dummy-data';
import { TransactionItem } from '../model/transaction-item';
import { DISCOUNTS } from './discounts';
import { PRODUCTS } from './products';
import { TRANSACTION_IDS } from './transactions';
import { v4 as uuidv4 } from 'uuid';

export const TRANSACTION_ITEMS: TransactionItem[] = Array.from(
  { length: 1200 },
  () => {
    const transactionId = getRandomItem(TRANSACTION_IDS);
    const discount = getRandomBoolean() ? getRandomItem(DISCOUNTS) : null;
    const quantity = getRandomNumber(1, 10);
    const product = getRandomItem(PRODUCTS);
    const note = null;

    // Make wasRefunded 'true' approx. 1 out of 5 times
    const wasRefunded = getRandomItem([true, false, false, false, false]);

    return TransactionItem.fromJSON({
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      transactionId,
      productId: product.id,
      discountId: discount ? discount.id : null,
      product,
      discount,
      wasRefunded,
      note,
      quantity,

      salePrice: 0,
      refundAmount: 0,
      discountAmount: 0,
      netSales: 0,
    });
  }
);
