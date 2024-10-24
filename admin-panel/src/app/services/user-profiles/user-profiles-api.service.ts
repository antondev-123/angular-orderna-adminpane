import { inject, Injectable } from '@angular/core';
import { IUserProfilesApiService } from './user-profiles-api.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/user';
import { UserProfileUpdateData } from '../../model/user-profile';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class UserProfilesApiService implements IUserProfilesApiService {
  private http = inject(HttpClient);

  getUserProfile(userId: User['id']): Observable<any> {
    return this.http.get(API_URL + `user-profiles/${userId}`);
  }
  updateUserProfile(userProfile: UserProfileUpdateData): Observable<any> {
    return this.http.put(
      API_URL + 'user-profile-update',
      JSON.stringify(userProfile)
    );
  }
}
