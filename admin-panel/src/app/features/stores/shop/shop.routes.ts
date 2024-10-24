import { Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ReviewOrderComponent } from './review-order/review-order.component';
import { OrderStatusComponent } from './order-status/order-status.component';

export default <Routes>[
  {
    path: '',
    component: ShopComponent,
  },
  {
    path: 'checkout',
    component: ReviewOrderComponent,
  },
  {
    path: 'order-status/:id',
    component: OrderStatusComponent,
  },
];
