import { inject, Injectable } from '@angular/core';
import { IUsersApiService } from './users-api.interface';
import { HttpClient } from '@angular/common/http';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Observable } from 'rxjs';
import { UserCreateData, UserUpdateData, IUser } from '../../model/user';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService implements IUsersApiService {
  private http = inject(HttpClient);

  createUser(user: UserCreateData): Observable<any> {
    return this.http.put(API_URL + 'user-create', JSON.stringify(user));
  }

  updateUser(user: UserUpdateData): Observable<any> {
    return this.http.put<IUser>(API_URL + 'user-update', JSON.stringify(user));
  }

  deleteUser(userId: IUser['id']): Observable<any> {
    return this.http.post(API_URL + 'user-delete', userId);
  }

  deleteUsers(userIds: IUser['id'][]): Observable<any> {
    return this.http.post(API_URL + 'user-delete-some', userIds);
  }

  deleteAllUsers(): Observable<any> {
    return this.http.delete(API_URL + 'user-delete-all');
  }

  deleteAllUsersExcept(userIds: IUser['id'][]): Observable<any> {
    return this.http.post(API_URL + 'user-delete-all-except', userIds);
  }

  getUsers(_options: QueryOptions<IUser>): Observable<Maybe<IUser[]>> {
    return this.http.get<IUser[]>(API_URL + 'users');
  }

  getTotalUsers(): Observable<any> {
    return this.http.get(API_URL + 'user-number');
  }
}
