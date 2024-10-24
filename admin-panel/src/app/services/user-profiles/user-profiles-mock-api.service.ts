import { Injectable } from '@angular/core';
import { IUserProfilesApiService } from './user-profiles-api.interface';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Data,
  getItem,
  updateItem,
} from '@orderna/admin-panel/src/utils/service';
import { IUser } from '../../model/user';
import {
  UserProfile,
  UserProfileUpdateData,
  IUserProfile,
} from '../../model/user-profile';
import { USER_PROFILES } from '../../data/user-profiles';

@Injectable({
  providedIn: 'root',
})
export class UserProfilesMockApiService implements IUserProfilesApiService {
  data = {
    user_profiles: {
      items: [...USER_PROFILES],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IUserProfile>,
      subject: new BehaviorSubject<Maybe<UserProfile[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get userProfilesData() {
    return this.data['user_profiles'] as Data<UserProfile, IUserProfile>;
  }

  getUserProfile(userId: IUser['id']): Observable<Maybe<UserProfile>> {
    return getItem(this.userProfilesData, userId);
  }
  updateUserProfile(
    userProfile: UserProfileUpdateData
  ): Observable<IUserProfile> {
    return updateItem(this.userProfilesData, userProfile);
  }
}
