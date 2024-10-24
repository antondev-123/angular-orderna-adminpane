import {
  ApplicationConfig,
  FactoryProvider,
  importProvidersFrom,
} from '@angular/core';
import {
  NavigationError,
  Router,
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { FlatpickrModule } from 'angularx-flatpickr';

import { routes } from './app.routes';

import { serviceProviders } from './common/providers/services.provider';
import { materialProviders } from './common/providers/material.provider';

import { headerInterceptor } from './common/interceptors/header.interceptor';

export function errorHandlerFactory(router: Router) {
  return () => {
    router.events.subscribe((event) => {
      if (event instanceof NavigationError) {
        router.navigate(['/404']);
        console.error(event.error);
      }
    });
  };
}

export const errorHandlerProvider: FactoryProvider = {
  provide: 'ErrorHandler',
  useFactory: errorHandlerFactory,
  deps: [Router],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([headerInterceptor])),
    provideNativeDateAdapter(),

    errorHandlerProvider,

    // Flatpickr
    importProvidersFrom(FlatpickrModule.forRoot()),

    ...materialProviders,
    ...serviceProviders,
  ],
};
