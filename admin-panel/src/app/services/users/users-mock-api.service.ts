import { Injectable } from '@angular/core';
import { IUsersApiService } from './users-api.interface';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { BehaviorSubject, Observable } from 'rxjs';
import { USERS } from '../../data/users';
import { IUser, User, UserCreateData, UserUpdateData } from '../../model/user';
import {
  createItem,
  Data,
  deleteAllItems,
  deleteAllItemsExcept,
  deleteItem,
  deleteItems,
  filterItems,
  getTotalItems,
  updateItem,
} from '@orderna/admin-panel/src/utils/service';
import { Status } from '../../model/enum/status';

@Injectable({
  providedIn: 'root',
})
export class UsersMockApiService implements IUsersApiService {
  data = {
    users: {
      items: [...USERS],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IUser>,
      subject: new BehaviorSubject<Maybe<User[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get usersData() {
    return this.data['users'] as Data<User, IUser>;
  }

  createUser(user: UserCreateData): Observable<IUser> {
    const newUser = User.fromJSON({
      ...user,
      id: this.usersData.items.length + 1,
      username: 'anonymous',
      password: '12345678',
      token: '12345678',
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      isOnboardingCompleted: false,
    });
    return createItem(this.usersData, newUser);
  }

  updateUser(user: UserUpdateData): Observable<IUser> {
    return updateItem(this.usersData, user);
  }

  deleteUser(userId: User['id']): Observable<IUser> {
    return deleteItem(this.usersData, userId);
  }

  deleteUsers(userIds: User['id'][]): Observable<IUser[]> {
    return deleteItems(this.usersData, userIds);
  }

  deleteAllUsers(): Observable<IUser[]> {
    return deleteAllItems(this.usersData);
  }

  deleteAllUsersExcept(userIds: User['id'][]): Observable<IUser[]> {
    return deleteAllItemsExcept(this.usersData, userIds);
  }

  getUsers(options: QueryOptions<IUser>): Observable<Maybe<IUser[]>> {
    return filterItems(this.usersData, options);
  }

  getTotalUsers(): Observable<Maybe<number>> {
    return getTotalItems(this.usersData);
  }
}
