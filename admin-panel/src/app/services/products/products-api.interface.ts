import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Observable } from 'rxjs';
import { Store } from '../../model/store';
import {
  ProductCreateData,
  ProductUpdateData,
  Product,
  IProduct,
} from '../../model/product';
import { Data } from '@orderna/admin-panel/src/utils/service';
import {
  ModifierGroup,
  ModifierGroupCreateData,
  ModifierGroupUpdateData,
} from '../../model/modifier-group';

export interface IProductsApiService {
  productsData: Data<Product, IProduct>;

  listProducts(storeId: number, categoryId?: number): Observable<any>;
  listProductsByCategories(
    storeId: number,
    categoryIds: number[]
  ): Observable<any>;
  createProduct(
    product: ProductCreateData,
    storeId: number,
    categoryId: number
  ): Observable<any>;
  updateProduct(
    product: ProductUpdateData,
    storeId: number,
    categoryId: number
  ): Observable<any>;
  deleteProduct(
    storeId: number,
    categoryId: number,
    productId: number
  ): Observable<any>;
  findAllProducts(): Observable<any>;
  numberOfProducts(): Observable<any>;
  deleteProducts(
    storeId: number,
    categoryId: number,
    productIds: number[]
  ): Observable<any>;
  deleteAllProducts(storeId: number, categoryId: number,productIds: Product['productId'][]): Observable<any>;
  deleteAllProductExcept(
    storeId: number,
    categoryId: number,
    exceptProductIds:Product['productId'][]
  ): Observable<any>;
  getProduct(
    storeId: Store['id'],
    productId: Product['id']
  ): Observable<Maybe<Product>>;
  getProducts(option: QueryOptions<IProduct>): Observable<Maybe<IProduct[]>>;
  createModifierGroup(data: ModifierGroupCreateData): Observable<ModifierGroup>;
  updateModifierGroup(data: ModifierGroupUpdateData): Observable<ModifierGroup>;
  deleteModifierGroup(id: ModifierGroup['id']): Observable<void>;
}
