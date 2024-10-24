import { inject, Injectable } from '@angular/core';
import { IProductsApiService } from './products-api.interface';
import { HttpClient } from '@angular/common/http';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { BehaviorSubject, Observable } from 'rxjs';

import { Store } from '../../model/store';
import {
  IProduct,
  Product,
  ProductCreateData,
  ProductUpdateData,
} from '../../model/product';
import { Data } from '@orderna/admin-panel/src/utils/service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import {
  ModifierGroup,
  ModifierGroupCreateData,
  ModifierGroupUpdateData,
} from '../../model/modifier-group';
import { environment } from '@orderna/admin-panel/src/environments/environment';

let API_URL = `${environment.api}/`;

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService implements IProductsApiService {
  private http = inject(HttpClient);

  data = {
    products: {
      items: [],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IProduct>,
      subject: new BehaviorSubject<Maybe<Product[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get productsData() {
    return this.data['products'] as Data<Product, IProduct>;
  }

  getProduct(
    page: number,
    size: number,
   
  ): Observable<Maybe<Product>> {
    const params = `?page=${page}&size=${size}`;
    return this.http.get<Product>(`${API_URL}${'products'}` + params);
  }

  listProducts(storeId: number, categoryId?: number): Observable<any> {
    return this.http.get(API_URL + 'product-all');
  }

  listProductsByCategories(
    storeId: number,
    categoryIds: number[]
  ): Observable<any> {
    return this.http.get(API_URL + 'product-all');
  }

  getStoreByProduct(storeId:any): Observable<any> {
    return this.http.get(`${API_URL}${'products'}/${'store'}/${storeId}`)
  }

  createProduct(
    product: ProductCreateData,
    storeId: number,
    categoryId: number
  ): Observable<any> {
    return this.http.post(`${API_URL}${'products'}`, JSON.stringify({...product, store: storeId}));
  }

  updateProduct(
    product: ProductUpdateData,
    productId : any,
    categoryId: number
  ): Observable<any> {
    return this.http.put(`${API_URL}${'products'}/${productId}`, JSON.stringify(product));
  }

  getProductById(productId:any): Observable<any> {
    return this.http.get(`${API_URL}${'products'}/${productId}`)
  }

  deleteProducts(
    storeId: number,
    categoryId: number,
    productIds: Product['productId'][]
  ): Observable<any> {
    console.log(productIds);
    
    return this.http.put(
      `${API_URL}${'products'}/${'delete-many'}`,{ids : productIds}
    );
  }

  deleteProduct(
    storeId: number,
    categoryId: number,
    productId: number
  ): Observable<any> {
    return this.http.delete(`${API_URL}products/${productId}`);
  }

  deleteAllProducts(
    storeId: number,
    categoryId: number,
    productIds: Product['productId'][]
  ): Observable<any> {    
    return this.http.put(
      `${API_URL}${'products'}/${'delete-many'}`,{ids : productIds}
    );
  }

  deleteAllProductExcept(
    storeId: number,
    categoryId: number,
    exceptProductIds:  Product['productId'][]
  ): Observable<any> {
    // Added temporary
    return this.http.post(
      API_URL + 'product-delete-all-except',
      exceptProductIds
    );
  }

  findAllProducts(): Observable<any> {
    return this.http.get(API_URL + 'product-all');
  }

  numberOfProducts(): Observable<any> {
    return this.http.get(API_URL + 'product-number');
  }

  getProducts(_options: QueryOptions<IProduct>): Observable<any> {
    return this.http.get(API_URL + 'products');
  }

 

  createModifierGroup(
    data: ModifierGroupCreateData
  ): Observable<ModifierGroup> {
    return this.http.post<ModifierGroup>(
      API_URL + 'modifier-group',
      JSON.stringify(data)
    );
  }

  updateModifierGroup(
    data: ModifierGroupUpdateData
  ): Observable<ModifierGroup> {
    return this.http.patch<ModifierGroup>(
      API_URL + 'modifier-group',
      JSON.stringify(data)
    );
  }

  deleteModifierGroup(id: ModifierGroup['id']): Observable<void> {
    return this.http.delete<void>(API_URL + 'modifier-group/' + id);
  }
}
