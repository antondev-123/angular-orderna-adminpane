import { Routes } from '@angular/router';
import { AccountingComponent } from './accounting/accounting.component';
import { SalesComponent } from './sales/sales.component';
import { RegisterComponent } from './register/register.component';

export default <Routes>[
  {
    path: 'accounting',
    component: AccountingComponent,
  },
  {
    path: 'sales',
    component: SalesComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
