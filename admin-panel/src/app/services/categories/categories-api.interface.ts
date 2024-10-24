import { Observable } from 'rxjs';
import {
  Category,
  CategoryCreateData,
  CategoryUpdateData,
} from '../../model/category';

export interface ICategoriesApiService {
  createCategory(
    category: CategoryCreateData,
    storeId: number
  ): Observable<any>;
  updateCategory(
    category: CategoryUpdateData,
    storeId: number
  ): Observable<any>;
  getCategoriesByStore(storeId: number): Observable<any>;
  deleteCategory(categoryId: Category['id']): Observable<boolean>;
}
