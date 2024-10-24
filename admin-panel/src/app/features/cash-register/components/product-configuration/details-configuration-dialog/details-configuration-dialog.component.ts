import { DialogRef } from '@angular/cdk/dialog';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DiscountFormComponent } from '../../discount/discount-form/discount-form.component';
import { DetailsConfigurationComponent } from '../details-configuration/details-configuration.component';
import { OrderProduct } from '@orderna/admin-panel/src/app/services/shared/order/order-product';
import { DiscountDetail } from '@orderna/admin-panel/src/app/model/discount';

@Component({
  selector: 'app-details-configuration-dialog',
  templateUrl: './details-configuration-dialog.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatTabsModule,
    DetailsConfigurationComponent,
    DiscountFormComponent,
  ],
})
export class DetailsConfigurationDialogComponent {
  #dialogRef = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA) as OrderProduct;

  protected close(): void {
    this.#dialogRef.close();
  }

  applyDiscount(discount: DiscountDetail | null): void {
    const order = new OrderProduct(this.data.product, this.data.quantity);
    order.newPrice = this.data.newPrice;
    order.note = this.data.note;
    order.discount = discount;
    this.#dialogRef.close(order);
  }
}
