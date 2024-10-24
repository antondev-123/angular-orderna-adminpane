import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountFormComponent } from '../components/discount-form/discount-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountsApiService } from '../../../services/discounts/discounts-api.service';

@Component({
  selector: 'app-discount-update',
  standalone: true,
  imports: [CommonModule, DiscountFormComponent],
  templateUrl: './discount-update.component.html',
  styleUrl: './discount-update.component.scss',
})
export class DiscountUpdateComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  discountsService = inject(DiscountsApiService);

  get discountId() {
    return +this.route.snapshot.params['discountId'];
  }

  discount$ = this.discountsService.getDiscount(this.discountId);
}
