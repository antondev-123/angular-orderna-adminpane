import { CanActivateFn, Router, Routes } from '@angular/router';
import { Role } from './model/enum/role';

import { NotFoundComponent } from './features/error/not-found/not-found.component';
import { UnauthorizedComponent } from './features/error/unauthorized/unauthorized.component';
import { authGuard, guestGuard, onboardingGuard } from './core/auth/auth.guards';
import { DefaultLayout } from './layouts/default-layout/default-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        loadChildren: async () => await import('./features/profile/profile.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN, Role.CASHIER] },
      },
      {
        path: 'dashboard',
        loadChildren: async () =>
          await import('./features/dashboard/dashboard.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'transactions',
        loadChildren: async () =>
          await import('./features/transactions/transactions.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'stores',
        loadChildren: async () => await import('./features/stores/stores.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'products',
        loadChildren: async () =>
          await import('./features/products/products.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'discounts',
        loadChildren: async () =>
          await import('./features/discounts/discounts.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'customers',
        loadChildren: async () =>
          await import('./features/customers/customers.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'suppliers',
        loadChildren: async () =>
          await import('./features/suppliers/suppliers.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'feedback',
        loadChildren: async () =>
          await import('./features/feedback/feedback.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'analytics',
        loadChildren: async () =>
          await import('./features/analytics/analytics.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'cash-register',
        loadChildren: async () =>
          await import('./features/cash-register/cash-register.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'cash-drawer',
        loadChildren: async () =>
          await import('./features/cash-drawer/cash-drawer.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'support',
        loadChildren: async () => await import('./features/support/support.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'users',
        loadChildren: async () => await import('./features/users/users.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'inventory',
        loadChildren: async () =>
          await import('./features/inventory/inventory.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'attendances',
        loadChildren: async () =>
          await import('./features/attendance/attendance.routes'),
        canActivate: [authGuard],
        data: { roles: [Role.ADMIN] },
      },
    ]
  },
  {
    path: 'login',
    loadComponent: async () =>
      (await import('./features/login/login.component')).LoginComponent,
    data: { layout: 'auth' },
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: async () =>
      (await import('./features/register/register.component'))
        .RegisterComponent,
    data: { layout: 'auth' },
    canActivate: [guestGuard],
  },
  {
    path: 'onboarding',
    loadChildren: async () =>
      await import('./features/onboarding/onboarding.routes'),
    data: { roles: [Role.ADMIN], layout: 'onboarding' },
    canActivate: [onboardingGuard],
  },

  {
    path: 'stores/:storeName/shop',
    loadChildren: async () =>
      await import('./features/stores/shop/shop.routes'),
    canActivate: [authGuard],
    data: { roles: [Role.ADMIN], layout: 'shop' },
  },
  {
    path: 'freeze',
    data: { layout: 'auth' },
    canActivate: [authGuard],
    loadComponent: async () =>
      (
        await import(
          './features/attendance/break-freeze/break-freeze.component'
        )
      ).BreakFreezeComponent,
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // TODO: Create layout for error pages
  //error
  { path: '404', component: NotFoundComponent },
  { path: '401', component: UnauthorizedComponent },

  // Catch-all route for unmatched paths
  { path: '**', component: NotFoundComponent },
];
