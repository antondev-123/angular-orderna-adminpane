import { DiscountDetail } from './discount';
import { Store } from './store';

export interface ISaleDiscountSummary {
  id: number;
  discount: DiscountDetail;
  usageCount: number;
  totalRedeemed: number;
  averageOrderValue: number;
  store: Store;
}

export class SaleDiscountSummary implements ISaleDiscountSummary {
  id: number;
  discount: DiscountDetail;
  usageCount: number;
  totalRedeemed: number;
  averageOrderValue: number;
  store: Store;

  constructor(
    id = 0,
    discount = new DiscountDetail(),
    usageCount = 0,
    totalRedeemed = 0,
    averageOrderValue = 0,
    store = new Store()
  ) {
    this.id = id;
    this.discount = discount;
    this.usageCount = usageCount;
    this.totalRedeemed = totalRedeemed;
    this.averageOrderValue = averageOrderValue;
    this.store = store;
  }
}
