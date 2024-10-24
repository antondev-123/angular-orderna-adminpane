import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { ICategory } from '@orderna/admin-panel/src/app/model/category';
import { IProduct } from '@orderna/admin-panel/src/app/model/product';
import { SelectedStoreService } from '@orderna/admin-panel/src/app/services/shared/selected-store/selected-store.service';
import { lastValueFrom } from 'rxjs';
import { OrderProduct } from '../../services/shared/order/order-product';
import { OrderService } from '../../services/shared/order/order.service';
import { CASH_REGISTER_PANEL_CLASS } from './cash-register.constant';
import { QuantityChoosingDialogComponent } from './components/quantity-choosing/quantity-choosing-dialog.component';
import { CategoriesApiService } from '../../services/categories/categories-api.service';

@Component({
  selector: 'app-cash-register-content',
  templateUrl: './cash-register-content.component.html',
  styleUrls: ['./cash-register-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatRadioModule],
})
export class CashRegisterContentComponent {
  #categoriesService = inject(CategoriesApiService);
  #storeService = inject(SelectedStoreService);
  #matDialog = inject(MatDialog);
  #destroyRef = inject(DestroyRef);
  #orderService = inject(OrderService);

  orderList = this.#orderService.orderList;

  selectedCategory = signal<number | undefined>(undefined);
  categories = signal<ICategory[]>([]);

  products = computed(() => {
    if (this.selectedCategory()) {
      return this.categories()
        .filter((category) => category.id === this.selectedCategory())
        .flatMap((category) => category.products);
    }

    return this.categories().flatMap((category) => category.products);
  });

  initCategories = effect(async () => {
    const categories = await lastValueFrom(
      this.#categoriesService.getCategoriesByStore(
        this.#storeService.selectedStore()
      )
    );
    this.categories.set(categories);
  });

  onSelectCategory(id: number | undefined): void {
    this.selectedCategory.set(id);
  }

  onProductSelect(product: IProduct): void {
    const orderProduct =
      this.#orderService.orderList().get(product.id) ||
      new OrderProduct(product, 1);

    this.#matDialog
      .open(QuantityChoosingDialogComponent, {
        panelClass: CASH_REGISTER_PANEL_CLASS,
        data: orderProduct,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((data: OrderProduct) => {
        if (data) {
          this.#orderService.modify(data);
        }
      });
  }
}
