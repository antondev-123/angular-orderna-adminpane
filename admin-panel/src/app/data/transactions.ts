import { PaymentType } from '../model/enum/payment-type';
import { TransactionStatus } from '../model/enum/transaction-status';
import { STORES } from './stores';
import { CUSTOMERS } from './customers';
import { v4 as uuidv4 } from 'uuid';
import {
  generateDate,
  getRandomBoolean,
  getRandomDate,
  getRandomEnumValue,
  getRandomItem,
  getRandomNumber,
} from '../../utils/dummy-data';
import { DateFilter } from '../../types/date-filter';
import { USERS } from './users';
import { TransactionType } from '../model/enum/transaction-type';
import { Transaction } from '../model/transaction';
import { DISCOUNTS } from './discounts';

function getNote() {
  return 'Submit purchase orders for a last buy quantity of the Product.';
}

// Generate 10 dummy transaction data per store
export const TRANSACTION_IDS = Array.from({ length: STORES.length * 10 }, () =>
  uuidv4()
);

export const TRANSACTIONS = TRANSACTION_IDS.map((id, index) => {
  const revenue = getRandomNumber(10, 1000);
  const cost = getRandomNumber(0, revenue - 5);
  const salesTaxRate = 0.1;
  const serviceChargeRate = getRandomBoolean() ? 0.12 : null;
  const discount = getRandomBoolean() ? getRandomItem(DISCOUNTS) : null;
  const tip = getRandomBoolean() ? getRandomNumber(10, 200) : null;

  return Transaction.fromJSON({
    id,
    transactionDate: getRandomDate(),
    tax: getRandomNumber(10, 100),
    service: getRandomNumber(10, 100),
    tip,
    revenue,
    refund: getRandomNumber(0, 200),
    grossAmount: revenue - cost,
    costOfGoods: cost,
    discount,
    salesTaxRate,
    serviceChargeRate,
    // Increase chances of getting APPROVED status
    status: getRandomItem([
      TransactionStatus.APPROVED,
      TransactionStatus.APPROVED,
      TransactionStatus.APPROVED,
      TransactionStatus.FAIL,
      TransactionStatus.PENDING,
      TransactionStatus.REFUNDED,
    ]),
    store: STORES[index % 10],
    user: getRandomItem(USERS),
    customer: getRandomItem(CUSTOMERS),
    paymentType: getRandomEnumValue(PaymentType),
    note: getNote(),
    transactionType: getRandomEnumValue(TransactionType),
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    salePrice: 0,
    refundAmount: 0,
    discountAmount: 0,
    netSales: 0,
    taxAmount: 0,
    serviceAmount: 0,
    grossSales: 0,

    // Transaction items data
    // Generated in transaction-items.ts
    total: 0,
    itemCount: 0,
    items: [],
  });
});
