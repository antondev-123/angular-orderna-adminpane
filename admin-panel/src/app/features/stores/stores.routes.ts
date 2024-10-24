import { Routes } from '@angular/router';
import { StoresComponent } from './stores.component';
import { EditStoreComponent } from './edit-store/edit-store.component';
import { AddStoreComponent } from './add-store/add-store.component';
import { StoreSettingsComponent } from './store-settings/store-settings.component';
import { Role } from '../../model/enum/role';

export default <Routes>[
  {
    path: '',
    component: StoresComponent,
  },
  {
    path: ':storeName/edit',
    component: EditStoreComponent,
  },
  {
    path: 'create',
    component: AddStoreComponent,
  },
  {
    path: ':storeName/edit/settings/:settingSlug',
    component: StoreSettingsComponent,
  },
];
