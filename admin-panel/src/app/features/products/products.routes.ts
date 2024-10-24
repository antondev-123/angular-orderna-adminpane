import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { StoreCategoriesComponent } from './store-categories/store-categories.component';

export default <Routes>[
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: 'edit/:storeId',
    component: StoreCategoriesComponent,
  },
];
