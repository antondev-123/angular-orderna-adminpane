import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Observable } from 'rxjs';
import { UserCreateData, IUser, UserUpdateData } from '../../model/user';

export interface IUsersApiService {
  createUser(user: UserCreateData): Observable<IUser>;
  updateUser(user: UserUpdateData): Observable<IUser>;
  deleteUser(userId: IUser['id']): Observable<IUser>;
  deleteUsers(userIds: IUser['id'][]): Observable<IUser[]>;
  deleteAllUsers(): Observable<IUser[]>;
  deleteAllUsersExcept(userIds: IUser['id'][]): Observable<IUser[]>;
  getUsers(option: QueryOptions<IUser>): Observable<Maybe<IUser[]>>;
  getTotalUsers(): Observable<Maybe<number>>;
}
