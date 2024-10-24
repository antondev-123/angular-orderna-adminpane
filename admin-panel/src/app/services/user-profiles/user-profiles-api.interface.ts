import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { IUser } from '../../model/user';
import {
  UserProfile,
  UserProfileUpdateData,
  IUserProfile,
} from '../../model/user-profile';

export interface IUserProfilesApiService {
  getUserProfile(userId: IUser['id']): Observable<Maybe<UserProfile>>;
  updateUserProfile(
    userProfile: UserProfileUpdateData
  ): Observable<IUserProfile>;
}
