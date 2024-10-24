import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICartItem } from '@orderna/admin-panel/src/app/model/store';
import { CartService } from '@orderna/admin-panel/src/app/services/cart/cart.service';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css'],
})
export class OrderStatusComponent implements OnInit {
  shopTypeRoute: string = '';
  items: ICartItem[] = [];
  subtotal: number = 0;
  taxes: number = 0;
  discount: number = 0;
  totalAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Retrieve the shopTypeRoute from route parameters
    this.shopTypeRoute = this.route.snapshot.params['storeName'];

    // Subscribe to cart items
    this.cartService.cartItems$.subscribe((items) => {
      this.items = items;
      this.calculateTotalAmount();
    });
  }

  calculateTotalAmount(): void {
    // Calculate subtotal
    this.subtotal = this.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Calculate taxes (assuming 10% tax rate)
    this.taxes = this.subtotal * 0.1;

    // Apply discount (assuming a fixed discount of $25)
    this.discount = 25;

    // Calculate total amount after applying discount and taxes
    this.totalAmount = this.subtotal + this.taxes - this.discount;
  }
}
