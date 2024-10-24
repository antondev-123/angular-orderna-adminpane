import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShopSidebarCartItemComponent } from '../shop-sidebar-cart-item/shop-sidebar-cart-item.component';
import { CommonModule } from '@angular/common';
import { ICartItem } from '@orderna/admin-panel/src/app/model/store';
import { CartService } from '@orderna/admin-panel/src/app/services/cart/cart.service';

@Component({
  selector: 'app-shop-sidebar-summary',
  standalone: true,
  imports: [ShopSidebarCartItemComponent, RouterModule, CommonModule],
  templateUrl: './shop-sidebar-summary.component.html',
  styleUrl: './shop-sidebar-summary.component.css',
})
export class ShopSidebarSummaryComponent {
  @Output() placeOrderForm = new EventEmitter<void>();
  @Input() placeOrder: boolean = false;
  @Input() editQuantity: boolean = false;
  items: ICartItem[] = [];
  subtotal: number = 0;
  taxes: number = 0;
  discount: number = 25; // Example discount
  total: number = 0;
  randomTestId: number = this.randomGenTestId();

  currentRoute: string = '';
  shopTypeRoute: string = '';
  checkoutRoute: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {
    this.currentRoute = this.router.url;
    this.shopTypeRoute = this.route.snapshot.params['storeName'];
    this.checkoutRoute = 'checkout'; // Adjust this as per your actual route setup
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      console.log('t', this.items);
      this.items = items;
      this.calculateTotals();
    });
    this.randomTestId = this.randomGenTestId();
  }

  onPlaceOrder(): void {
    this.placeOrderForm.emit();
    this.router.navigate([
      '/stores',
      this.shopTypeRoute,
      'shop',
      'order-status',
      this.randomTestId,
    ]);
  }

  calculateTotals(): void {
    this.subtotal = +this.items
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      .toFixed(2);
    this.taxes = +(this.subtotal * 0.23).toFixed(2); // Example tax rate of 23%
    this.total = +(this.subtotal + this.taxes - this.discount).toFixed(2);
  }

  randomGenTestId(): number {
    return Math.floor(Math.random() * 5);
  }
}
