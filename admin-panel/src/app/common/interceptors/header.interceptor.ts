import { HttpRequest, HttpEvent, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthApiService } from '../../core/auth/auth-api.service';

export function headerInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthApiService);
  const accessToken = authService.getAccessToken();

  if (accessToken) {
    request = addAuthorizationHeader(request, accessToken);
  }

  request = addContentTypeHeader(request);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return authService.getRefreshToken().pipe(
          switchMap((newToken) => {
            return next(addAuthorizationHeader(request, newToken));
          }),
          catchError(() => {
            authService.logOut();
            throw error;
          })
        );
      }
      throw error;
    }),
  );
}

function addAuthorizationHeader(
  request: HttpRequest<any>,
  token: string
): HttpRequest<any> {
  if (request.headers.has('Authorization')) {
    return request;
  }

  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function addContentTypeHeader(request: HttpRequest<any>): HttpRequest<any> {
  if (!request.headers.has('Content-Type')) {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
  }
  return request;
}
