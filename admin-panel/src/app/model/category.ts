import { Product } from './product';

export interface ICategory {
  id?: number;
  name: string;
  description: string;
  products: Product[];
  categoryId?: number;
}

export type CategoryCreateData = Pick<ICategory, 'name' | 'description'>;
export type CategoryUpdateData = Omit<ICategory, 'products'>;

export class Category implements ICategory {
  id?: number;
  name: string;
  description: string;
  products: Product[];
  categoryId?: number

  constructor({
    id = 0,
    name = '',
    description = '',
    products = [],
    categoryId = 0,
  }: Partial<Category> = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.products = products;
    this.categoryId = categoryId;
  }
}
