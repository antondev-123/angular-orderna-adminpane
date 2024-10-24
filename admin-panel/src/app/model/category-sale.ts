import { Category } from './category';
import { Store } from './store';

export interface ICategorySale {
  id: number;
  category: Category;
  unitsSold: number;
  revenue: number;
  store: Store;
}

export class CategorySale implements ICategorySale {
  id: number;
  category: Category;
  unitsSold: number;
  revenue: number;
  store: Store;

  constructor(
    id = 0,
    category = new Category(),
    unitsSold = 0,
    revenue = 0,
    store = new Store()
  ) {
    this.id = id;
    this.category = category;
    this.unitsSold = unitsSold;
    this.revenue = revenue;
    this.store = store;
  }
}
