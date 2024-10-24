import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StoresApiService } from '@orderna/admin-panel/src/app/core/stores/stores-api.service';
import { CartService } from '@orderna/admin-panel/src/app/services/cart/cart.service';
import { QuantitySelectorComponent } from '@orderna/admin-panel/src/app/shared/components/form/counter/quantity-selector.component';
import { ShopProductModalComponent } from '@orderna/admin-panel/src/app/shared/components/modal/shop-product-modal/shop-product-modal.component';
import { IProduct } from '@orderna/admin-panel/src/app/model/product';

@Component({
  selector: 'app-shop-item',
  standalone: true,
  imports: [CommonModule, QuantitySelectorComponent, ShopProductModalComponent],
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.css',
})
export class ShopItemComponent {
  @Input() isDiscounted = false;
  @Input() isSoldOut = false;
  @Input() productId: number = 1; // Assume productId is passed as an input

  productDetailModalOpen: boolean = false;
  productDetailModalId: string = 'product-details-modal';
  product: IProduct | undefined; // Use IProduct type for the product
  productQuantity: number = 1; // Initialize productQuantity

  constructor(
    private storeService: StoresApiService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProductDetail(this.productId);
  }

  toggleModal(open: boolean, event: any) {
    console.log(`toggleModal called with: ${open}`);
    this.productDetailModalOpen = open;
    console.log(`Modal open state: ${this.productDetailModalOpen}`);
    event.stopPropagation(); // Prevent event from bubbling up
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.productQuantity);
      this.toggleModal(false, new Event('click'));
    }
  }

  updateQuantity(newQuantity: number): void {
    this.productQuantity = newQuantity;
    if (this.product) {
      this.product.stock = newQuantity;
    }
  }

  loadProductDetail(productId: number): void {
    this.storeService.getProductById(productId).subscribe(
      (product: IProduct | undefined) => {
        if (product) {
          console.log('products', product);
          this.product = product;
          this.productQuantity = product.stock ?? 1; // Use product quantity or default to 1
        } else {
          console.error(`Product with ID ${productId} not found.`);
          // Optionally handle the case where the product is not found
        }
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }
}
