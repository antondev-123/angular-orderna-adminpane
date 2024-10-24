import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shop-sidebar-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-sidebar-cart-item.component.html',
  styleUrl: './shop-sidebar-cart-item.component.css'
})
export class ShopSidebarCartItemComponent {
  @Input() item: any;
  @Input() editable: boolean = false;
}
