import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Product } from '../../../../model/product';

@Component({
  selector: 'app-customer-top-recent-products',
  standalone: true,
  imports: [],
  templateUrl: './customer-top-recent-products.component.html',
  styleUrl: './customer-top-recent-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTopRecentProductsComponent {
  data = input<Product['title'][]>([]);
}
