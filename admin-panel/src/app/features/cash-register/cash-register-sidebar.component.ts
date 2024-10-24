import { DecimalPipe, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { CustomerModalComponent } from '@orderna/admin-panel/src/app/features/customers/components/customer-modals/customer-modal.component';
import { ButtonComponent } from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { InvoiceDiscountDialogComponent } from './components/discount/invoice-discount/invoice-discount-dialog.component';
import { CASH_REGISTER_PANEL_CLASS } from './cash-register.constant';
import { CustomerDetailsDialogComponent } from './components/customer-details/customer-details-dialog.component';
import { PaymentOptionsDialogComponent } from './components/payment-options/payment-options-dialog.component';
import { CashChangeDialogComponent } from './components/cash-change/cash-change-dialog.component';
import { DetailsConfigurationDialogComponent } from './components/product-configuration/details-configuration-dialog/details-configuration-dialog.component';
import { OrderService } from '../../services/shared/order/order.service';
import { OrderProduct } from '../../services/shared/order/order-product';
import { DiscountType } from '../../model/enum/discount-type';
import { MatIconModule } from '@angular/material/icon';
import { OrderCompleteComponent } from './components/order-complete/order-complete.component';

@Component({
  selector: 'app-cash-register-sidebar',
  templateUrl: './cash-register-sidebar.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, KeyValuePipe, DecimalPipe, MatIconModule],
})
export class CashRegisterSidebarComponent {
  DiscountType = DiscountType;

  #matDialog = inject(MatDialog);
  #orderService = inject(OrderService);
  #destroyRef = inject(DestroyRef);

  orderList = this.#orderService.orderList;
  generalDiscount = this.#orderService.generalDiscount;
  taxes = this.#orderService.taxes;
  subtotal = this.#orderService.subTotal;
  total = this.#orderService.total;
  customer = this.#orderService.customer;

  #paymentType = this.#orderService.paymentType;

  openDiscountDialog(): void {
    this.#matDialog
      .open(InvoiceDiscountDialogComponent, {
        panelClass: CASH_REGISTER_PANEL_CLASS,
        data: {
          discount: this.generalDiscount(),
          maxDiscount: this.subtotal(),
        },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((discount) => {
        this.#orderService.setGeneralDiscount(discount);
      });
  }

  openCashChangeDialog(): void {
    this.#matDialog
      .open(CashChangeDialogComponent, {
        panelClass: CASH_REGISTER_PANEL_CLASS,
        data: this.total(),
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#orderService.reset();
        this.#matDialog.open(OrderCompleteComponent, {
          panelClass: CASH_REGISTER_PANEL_CLASS,
        });
      });
  }

  openCustomerDetailsDialog(): void {
    const dialogRef = this.#matDialog.open(CustomerDetailsDialogComponent, {
      panelClass: CASH_REGISTER_PANEL_CLASS,
      data: this.#orderService.customer(),
    });

    dialogRef.componentInstance.addCustomer.subscribe(() => {
      this.openAddCustomerDialog();
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((customer) => {
        if (customer) {
          this.#orderService.setCustomer(customer);
        }
      });
  }

  openPaymentOptionsDialog(): void {
    this.#matDialog
      .open(PaymentOptionsDialogComponent, {
        panelClass: CASH_REGISTER_PANEL_CLASS,
        data: this.#paymentType(),
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((selectedPaymentType) => {
        if (selectedPaymentType) {
          this.#orderService.setPaymentType(selectedPaymentType);
        }
      });
  }

  openProductConfigurationDialog(orderedProduct: OrderProduct): void {
    this.#matDialog
      .open(DetailsConfigurationDialogComponent, {
        panelClass: CASH_REGISTER_PANEL_CLASS,
        data: orderedProduct,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((order) => {
        if (order) {
          this.#orderService.modify(order);
        }
      });
  }

  removeOrder(orderedProduct: OrderProduct): void {
    this.#orderService.removeOrder(orderedProduct.product.id);
  }

  removeCustomer(): void {
    this.#orderService.removeCustomer();
  }

  private openAddCustomerDialog(): void {
    this.#matDialog.open(CustomerModalComponent, {
      panelClass: CASH_REGISTER_PANEL_CLASS,
      data: { customer: undefined },
    });
  }
}
