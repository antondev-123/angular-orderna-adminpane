import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { PercentagePipe } from '../../common/pipes/percentage/percentage.pipe';
import { StoreCardsSkeletonComponent } from './components/store-cards-skeleton/store-cards-skeleton.component';
import { ProductsApiService } from '../../services/products/products-api.service';
import { Product } from '../../model/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    PercentagePipe,

    CardComponent,
    ButtonComponent,
    ButtonTextDirective,
    StoreCardsSkeletonComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private productsService = inject(ProductsApiService);
  private router = inject(Router);

  private readonly page = 1;
  private readonly perPage = 5;
  searchTerm = "";
  sort = "";
  field = "";

  products$: Observable<Product[] | null> = this.productsService
    .getProduct(this.page, this.perPage)
    .pipe(map((response: any) => {
      return response.data.product
    }));
  products = toSignal<any[] | null>(this.products$, { initialValue: null });

  public editCategories(storeId: any) {
    this.router.navigate([`/products/edit/${storeId}`]);
  }
}
