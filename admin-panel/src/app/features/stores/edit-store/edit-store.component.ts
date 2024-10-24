import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButtonComponent } from '../../../shared/components/button/back-button/back-button.component';

@Component({
  selector: 'app-edit-store',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './edit-store.component.html',
  styleUrl: './edit-store.component.css',
})
export class EditStoreComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);

  get slug() {
    return this.route.snapshot.params['storeName'];
  }

  storeSettings = [
    {
      name: 'General',
      slug: 'general',
      description:
        'View and update your store details, contact info and physical address',
    },
    {
      name: 'Opening Hours',
      slug: 'opening-hours',
      description: 'Control when customers can order from you',
    },
  ];

  onClick(setting: any) {
    this.router.navigate([
      `/stores/${this.slug}/edit/settings/${setting.slug}`,
    ]);
  }

  goToStoresPage() {
    this.router.navigate(['stores']);
  }
}
