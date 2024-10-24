import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  User,
  UserCredentials,
  UserRegistrationData,
} from '@orderna/admin-panel/src/app/model/user';
import { environment } from '@orderna/admin-panel/src/environments/environment';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthTokenPayload } from './auth-token-payload';
import { Role } from '../../model/enum/role';
import { LocalStorageService } from '../../shared/services/local-storage.service';

let API_URL = `${environment.api}/auth`;

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private currentUserSubject = new BehaviorSubject<Maybe<User>>(null);
  currentUser = this.currentUserSubject.asObservable();

  #router = inject(Router);
  #localStorageService = inject(LocalStorageService);
  #http = inject(HttpClient);

  public get currentUserValue(): Maybe<User> {
    return this.currentUserSubject.value;
  }

  getAccessToken() {
    return this.#localStorageService.getAccessToken();
  }
  
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getRefreshToken(): Observable<any> {
    const refreshToken = this.#localStorageService.getRefreshToken();
    return this.#http.post(`${API_URL}/token`, {}, { headers: { Authorization: `Bearer ${refreshToken}` } }).pipe(
      tap((response: any) => {
        localStorage.setItem('accessToken', response.data.accessToken);
      }),
    );
  }

  getAuthTokenPayload(): AuthTokenPayload | null {
    const token = this.#localStorageService.getAccessToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1])) as AuthTokenPayload;
    } catch (error) {
      return null;
    }
  }

  hasRole(requiredRoles: Role[], user: User): boolean {
    return requiredRoles.length === 0 || requiredRoles.includes(user.role);
  }

  isOnboardingCompleted(user: User): boolean {
    return user.isOnboardingCompleted;
  }

  login(user: UserCredentials) {
    return this.#http.post<any>(API_URL + '/login', { email: user.email, password: user.password }).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        window.location.href = '/';
      }),
    );
  }

  logOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    window.location.reload();
  }

  register(user: UserRegistrationData): Observable<any> {
    return this.#http.post(`${API_URL}/signup`, JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json; charset=UTF-8 ' },
    }).pipe(tap((response: any) => {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      this.#router.navigate(['/onboarding']);
    }));
  }

  getUserProfile(): Observable<User> {
      return this.#http.get<User>(`${API_URL}/whoami`).pipe(
        map((response: any) => response.data), 
        tap((response: any) => {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        })
      );
  }
}
