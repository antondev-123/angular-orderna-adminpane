import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import { take } from 'rxjs';
import { Category } from '../../../model/category';
import { Product } from '../../../model/product';
import { CategoriesApiService } from '../../../services/categories/categories-api.service';
import { ProductsApiService } from '../../../services/products/products-api.service';
import { BackButtonComponent } from '../../../shared/components/button/back-button/back-button.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../shared/components/button/button.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { AddEditProductsComponent } from '../components/add-edit-products/add-edit-products.component';
import { CategoryCardsSkeletonComponent } from '../components/category-cards-skeleton/category-cards-skeleton.component';
import { CategoryConfirmDeleteModalComponent } from '../components/category-confirm-delete-modal/category-confirm-delete-modal.component';
import { CategoryModalComponent } from '../components/category-modal/category-modal.component';
import { StoresDataSource } from '../../../services/data-sources/stores.dataSource';
import { StoresApiService } from '../../../core/stores/stores-api.service';

@Component({
  selector: 'app-store-categories',
  standalone: true,
  imports: [
    CommonModule,

    AsyncPipe,

    MatExpansionModule,
    MatIconModule,

    ButtonComponent,
    BackButtonComponent,
    ButtonTextDirective,
    TableComponent,
    CategoryCardsSkeletonComponent,
    AddEditProductsComponent,
  ],
  templateUrl: './store-categories.component.html',
  styleUrl: './store-categories.component.css',
})
export class StoreCategoriesComponent {
  @Input() public storeId!: string;

  private router = inject(Router);

  storesDataSource = new StoresDataSource(this.storesService);
  stores$ = this.storesDataSource.stores$.asObservable();
  
  public categories!: any[];
  public readonly columns: TableColumn<Product>[] = [
    {
      key: 'title',
      type: 'square-img-plus-string',
      label: 'Title',
    },
    {
      key: 'modifiers',
      type: 'string',
      label: 'Modifiers',
    },
    {
      key: 'skuPlu',
      type: 'string',
      label: 'SKU/PLU',
    },
    {
      key: 'unit',
      type: 'string',
      label: 'Unit',
    },
    {
      key: 'stock',
      type: 'string',
      label: 'Stock',
    },
    {
      key: 'cost',
      type: 'string',
      label: 'Cost',
    },
    {
      key: 'price',
      type: 'currency',
      label: 'Price',
    },
    // {
    //   key: 'status',
    //   type: 'badge',
    //   label: 'Status',
    // },
  ];

  page: number = 1;
  size: number = 50;
  search: string = '';
  sort: string = '';
  field: string = '';
  storeName: string = '';

  constructor(
    private dialog: MatDialog,
    private categoriesService: CategoriesApiService,
    private productService: ProductsApiService,
    private storesService: StoresApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getStoreByCategory();
    this.storesDataSource.loadStores(1, 5000);
  }

  ngAfterViewInit()
  {
    this.stores$.subscribe((stores: any[]) => {
      const store = stores.find((store) => store.id == this.storeId);
        if (store) {
          this.storeName = store.name;
        } 
      })
  }

  getCategories() {
    this.categoriesService
      .getCategories(this.page, this.size, this.search, this.sort, this.field)
      .subscribe((response) => {
        this.categories = response.data.category;
      });
  }

  getStoreByCategory() {
    this.productService
      .getStoreByProduct(this.storeId)
      .subscribe((response) => {
        this.categories = response.data;
      });
  }

  handleEditCategory(event: MouseEvent, category?: Category) {
    event.stopPropagation();
    this.openCategoryModal('edit', category);
  }

  handleDeleteCategory(event: MouseEvent, category: Category) {
    event.stopPropagation();
    this.openCategoryConfirmDeleteModal(category);
  }

  openCategoryConfirmDeleteModal(category: Category) {
    const dialogRef = this.dialog.open(CategoryConfirmDeleteModalComponent, {
      id: 'confirm-delete-category-modal',
      data: {
        category,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (!result) return;
        const categoryIndex = this.categories.findIndex(
          (c) => c.id === category.categoryId
        );
        if (categoryIndex !== -1) {
          this.categories.splice(categoryIndex, 1);
        }
        this.getStoreByCategory();
      });
  }

  openCategoryModal(mode: 'create' | 'edit', category?: Category) {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      id: 'category-modal',
      width: '512px',
      data: {
        storeId: this.storeId,
        mode,
        category,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result === undefined) {
        } else {
          this.categories = result;
          this.getStoreByCategory();
          this.cdr.detectChanges();
        }
      });
  }

  protected backToProducts(): void {
    this.router.navigate(['products']);
  }
}
