import { Injectable, computed, signal } from '@angular/core';
import { PaymentType } from '../../../model/enum/payment-type';
import { OrderProduct } from './order-product';
import { DiscountType } from '../../../model/enum/discount-type';
import { ICustomer } from '../../../model/customer';
import { DiscountDetail } from '../../../model/discount';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  #orderList = signal<Map<number, OrderProduct>>(new Map());
  #generalDiscount = signal<DiscountDetail | undefined>(undefined);
  #paymentType = signal<PaymentType>(PaymentType.CASH);
  #customer = signal<ICustomer | undefined>(undefined);
  #displayVoidTransaction = signal(false);

  paymentType = this.#paymentType.asReadonly();
  generalDiscount = this.#generalDiscount.asReadonly();
  orderList = this.#orderList.asReadonly();
  customer = this.#customer.asReadonly();
  displayVoidTransaction = this.#displayVoidTransaction.asReadonly();

  subTotal = computed(() =>
    Array.from(this.orderList().entries()).reduce(
      (acc, [_, orderItem]) => acc + orderItem.getDiscountedTotal(),
      0
    )
  );
  taxes = computed(() => this.subTotal() * 0.1);
  total = computed(() => {
    let finalPrice = this.subTotal();

    if (this.generalDiscount()?.type === DiscountType.FIXED) {
      finalPrice = finalPrice - this.generalDiscount()!.value;
    }

    if (this.generalDiscount()?.type === DiscountType.PERCENTAGE) {
      finalPrice =
        finalPrice - (finalPrice * this.generalDiscount()!.value) / 100;
    }

    return finalPrice + this.taxes();
  });

  setCustomer(customer: ICustomer): void {
    this.#customer.set(customer);
  }

  setDisplayVoidTransaction(display: boolean): void {
    this.#displayVoidTransaction.set(display);
  }

  setGeneralDiscount(discount: DiscountDetail): void {
    this.#generalDiscount.set(discount);
  }

  setPaymentType(paymentType: PaymentType) {
    this.#paymentType.set(paymentType);
  }

  modify(orderProduct: OrderProduct): void {
    this.#orderList.update((orderList) => {
      orderList.set(orderProduct.product.id, orderProduct);
      return new Map(orderList);
    });
  }

  removeOrder(id: number): void {
    this.#orderList.update((orderList) => {
      orderList.delete(id);
      return new Map(orderList);
    });
  }

  removeCustomer(): void {
    this.#customer.set(undefined);
  }

  reset(): void {
    this.#orderList.set(new Map());
    this.#generalDiscount.set(undefined);
    this.#paymentType.set(PaymentType.CASH);
    this.#customer.set(undefined);
  }
}
