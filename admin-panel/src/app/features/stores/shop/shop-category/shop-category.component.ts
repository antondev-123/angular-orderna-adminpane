import { Component, Input } from '@angular/core';
import { ShopItemComponent } from '../shop-item/shop-item.component';

@Component({
  selector: 'app-shop-category',
  standalone: true,
  imports: [ShopItemComponent],
  templateUrl: './shop-category.component.html',
  styleUrl: './shop-category.component.css'
})
export class ShopCategoryComponent {
  @Input() id!: number;
  @Input() title!: string;
  @Input() description!: string;
}
