import { Product } from './product';
import { Store } from './store';

export interface IProductSale {
  id: number;
  product: Product;
  orders: number;
  revenue: number;
  store: Store;
}

export class ProductSale implements IProductSale {
  id: number;
  product: Product;
  orders: number;
  revenue: number;
  store: Store;

  constructor(
    id = 0,
    product = new Product(),
    orders = 0,
    revenue = 0,
    store = new Store()
  ) {
    this.id = id;
    this.product = product;
    this.orders = orders;
    this.revenue = revenue;
    this.store = store;
  }
}
