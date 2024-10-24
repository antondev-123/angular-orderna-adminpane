import { Routes } from '@angular/router';
import { DiscountsComponent } from './discounts.component';
import { DiscountCreateComponent } from './discount-create/discount-create.component';
import { DiscountUpdateComponent } from './discount-update/discount-update.component';
import { DiscountDetailComponent } from './discount-detail/discount-detail.component';

export default <Routes>[
  {
    path: '',
    component: DiscountsComponent,
  },
  {
    path: 'create',
    component: DiscountCreateComponent,
  },
  {
    path: 'edit/:discountId',
    component: DiscountUpdateComponent,
  },
  {
    path: ':discountId',
    component: DiscountDetailComponent,
  },
];
