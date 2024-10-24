import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategoriesApiService } from './categories-api.interface';
import {
  Category,
  CategoryCreateData,
  CategoryUpdateData,
} from '../../model/category';
import { environment } from '@orderna/admin-panel/src/environments/environment';

const CATEGORY_URL = `${environment.api}/categories`;

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService implements ICategoriesApiService {
  private http = inject(HttpClient);

  getCategories(page: number, size: number, search: string, sort: string, field: string, storeId?: number): Observable<any> {
    const params = `?page=${page}&size=${size}&search=${search}&sort=${sort}&field=${field}`
    return this.http.get(CATEGORY_URL + params);
  }

  getCategoriesByStore(storeId: number): Observable<any> {
    return this.http.get(CATEGORY_URL + 'category/' + storeId);
  }

  createCategory(
    category: CategoryCreateData,
  ): Observable<any> {
    return this.http.post(CATEGORY_URL, category);
  }

  updateCategory(
    category: CategoryUpdateData,
    categotyId: number
  ): Observable<any> {
    return this.http.put(`${CATEGORY_URL}/${categotyId}`, category);
  }

  deleteCategory(categoryId: Category['categoryId']): Observable<boolean> {
    return this.http.delete<boolean>(`${CATEGORY_URL}/${categoryId}`);
  }
}
