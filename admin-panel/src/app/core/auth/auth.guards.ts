import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthApiService } from "./auth-api.service";
import { map, of, switchMap } from "rxjs";

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};


export const authGuard: CanActivateFn = (route, _) => {
  const authService = inject(AuthApiService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] ?? [];

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  
  let availablecurrentUser = localStorage.getItem('currentUser');
  
    return authService.getUserProfile().pipe(
      switchMap((user:any) => {
        if (!authService.hasRole(requiredRoles, user)) {
          router.navigate(['/401']);
          return of(false);
        }
        if(!availablecurrentUser)
          {
      if(user?.stores?.length > 0)
        {
           router.navigate(['/dashboard']).then(() => user);
        }
        else
        {
           router.navigate(['/onboarding']).then(() => user);
        }
      }
        return of(true);
      }),
    ); 
}

export const onboardingGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthApiService);

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  return authService.getUserProfile().pipe(
    switchMap((user) => {
      if (user.isOnboardingCompleted) {
        router.navigate(['/']);
        return of(false);
      }
      return of(true);
    }),
  );
};