import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IUser } from '../../model/user';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { UsersApiService } from '../users/users-api.service';

@Injectable()
export class UsersDataSource extends DataSource<IUser> {
  users$ = new BehaviorSubject<IUser[]>([]);
  totalUsers$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private usersSubscription: Maybe<Subscription>;
  private totalUsersSubscription: Maybe<Subscription>;

  constructor(private usersService: UsersApiService) {
    super();
  }

  connect(): Observable<IUser[]> {
    return this.users$.asObservable();
  }

  disconnect(): void {
    this.users$.complete();
    this.totalUsers$.complete();
    this.isLoading$.complete();
    this.usersSubscription?.unsubscribe();
    this.totalUsersSubscription?.unsubscribe();
  }

  loadTotalUsers(): void {
    this.totalUsersSubscription?.unsubscribe();
    this.totalUsersSubscription = this.usersService
      .getTotalUsers()
      .subscribe((totalUsers) => {
        this.totalUsers$.next(totalUsers ?? 0);
      });
  }

  loadUsers(options: QueryOptions<IUser>): void {
    this.isLoading$.next(true);
    this.usersSubscription?.unsubscribe();
    this.usersSubscription = this.usersService
      .getUsers(options)
      .subscribe((users) => {
        console.log('loadUsers', users);
        this.isLoading$.next(false);
        this.users$.next(users ?? []);
      });
  }
}
