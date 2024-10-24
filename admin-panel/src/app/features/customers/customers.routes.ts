import { Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

export default <Routes>[
  {
    path: '',
    component: CustomersComponent,
  },
  {
    path: ':customerId',
    component: CustomerDetailComponent,
  },
];
