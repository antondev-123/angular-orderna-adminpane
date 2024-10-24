import { DiscountDetail } from '../../../model/discount';
import { DiscountType } from '../../../model/enum/discount-type';
import { IProduct } from '../../../model/product';

export class OrderProduct {
  #product: IProduct;
  #quantity: number;
  #newPrice?: number;
  #note?: string;
  #discount?: DiscountDetail | null;

  constructor(product: IProduct, quantity: number) {
    this.#product = product;
    this.#quantity = quantity;
  }

  getTotal(): number {
    return this.price * this.quantity;
  }

  getDiscountedTotal(): number {
    if (this.#discount?.type === DiscountType.FIXED) {
      return (this.price - this.#discount.value) * this.quantity;
    }

    if (this.#discount?.type === DiscountType.PERCENTAGE) {
      return (
        (this.price - (this.price * this.#discount.value) / 100) * this.quantity
      );
    }

    return this.price * this.quantity;
  }

  get product() {
    return this.#product;
  }

  get quantity() {
    return this.#quantity;
  }

  set quantity(value: number) {
    this.#quantity = value;
  }

  get price() {
    return this.#newPrice || this.#product.price;
  }

  set newPrice(value: number | undefined) {
    this.#newPrice = value;
  }

  get newPrice() {
    return this.#newPrice;
  }

  get note() {
    return this.#note;
  }

  set note(value: string | undefined) {
    this.#note = value;
  }

  set discount(value: DiscountDetail | undefined | null) {
    this.#discount = value;
  }

  get discount() {
    return this.#discount;
  }
}
