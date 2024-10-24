import { Routes } from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component';
import { PurchasesComponent } from './purchases/purchases.component';

export default <Routes>[
  {
    path: 'inventory',
    component: InventoryComponent,
  },
  {
    path: 'purchases',
    component: PurchasesComponent,
  },
];
