// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAddress, ICartItem } from '../../model/store';
import { IProduct } from '../../model/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<ICartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private billingInfoSubject = new BehaviorSubject<IAddress | null>(null);
  billingInfo$ = this.billingInfoSubject.asObservable();
  addToCart(product: IProduct, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItemsSubject.next(currentItems);
  }

  removeFromCart(productId: number): void {
    const updatedItems = this.cartItemsSubject.value.filter(
      (item) => item.product.id !== productId
    );
    this.cartItemsSubject.next(updatedItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  getTotalAmount(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
  setBillingInfo(billingInfo: IAddress): void {
    this.billingInfoSubject.next(billingInfo);
  }
}
