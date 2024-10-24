import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  inject,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Category } from '@orderna/admin-panel/src/app/model/category';
import { Product, IProduct } from '@orderna/admin-panel/src/app/model/product';
import { Store } from '@orderna/admin-panel/src/app/model/store';
import { ProductsDataSource } from '@orderna/admin-panel/src/app/services/data-sources/products.dataSource';
import { ProductsApiService } from '@orderna/admin-panel/src/app/services/products/products-api.service';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { DashedBorderAddButtonComponent } from '@orderna/admin-panel/src/app/shared/components/button/dashed-border-add-button/dashed-border-add-button.component';
import { ProductConfirmBulkDeleteModalComponent } from '@orderna/admin-panel/src/app/shared/components/modal/products/product-confirm-bulk-delete-modal.component';
import { ProductConfirmDeleteModalComponent } from '@orderna/admin-panel/src/app/shared/components/modal/products/product-confirm-delete-modal.component';
import { ProductModalComponent } from '@orderna/admin-panel/src/app/shared/components/modal/products/product-modal.component';
import { PaginationComponent } from '@orderna/admin-panel/src/app/shared/components/pagination/pagination.component';
import { RowControlComponent } from '@orderna/admin-panel/src/app/shared/components/row-controls/row-controls.component';
import { TableSkeletonComponent } from '@orderna/admin-panel/src/app/shared/components/table/table-skeleton.component';
import { TableComponent } from '@orderna/admin-panel/src/app/shared/components/table/table.component';
import {
  QueryOptions,
  DEFAULT_QUERY_OPTIONS,
} from '@orderna/admin-panel/src/types/query-options';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import {
  Observable,
  switchMap,
  combineLatest,
  map,
  catchError,
  of,
  take,
} from 'rxjs';

interface PageData {
  isLoading: boolean;
  numberOfProduct: number;
}

@Component({
  selector: 'app-add-edit-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    ButtonComponent,
    ButtonTextDirective,
    DashedBorderAddButtonComponent,

    RowControlComponent,
    PaginationComponent,

    MatExpansionModule,
    TableComponent,
    TableSkeletonComponent,
  ],
  templateUrl: './add-edit-products.component.html',
  styleUrl: './add-edit-products.component.css',
})
export class AddEditProductsComponent {
  @ViewChild(TableComponent) table!: TableComponent<Product>;
  @Output() public onChange = new EventEmitter<any>();
  @Input() category: any;
  @Input() products: Product[] = [];
  @Input() storeDetails!: { storeId: Store['id']; categoryId?: Category['id'] };

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  data$!: Observable<PageData>;

  errorMessage?: string;
  infoMessage?: string;
  countItemsToDelete = [];

  public readonly columns: TableColumn<IProduct>[] = [
    {
      key: 'title',
      type: 'square-img-plus-string',
      label: 'Title',
    },
    {
      key: 'modifiersCount',
      type: 'number',
      label: 'Modifiers',
    },
    {
      key: 'sk_plu',
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
  ];

  productDataSource = new ProductsDataSource(this.productsService);

  numberOfProduct$ = this.productDataSource.totalProducts$.asObservable();
  productList$ = this.productDataSource.products$.asObservable();

  isLoading$ = this.productDataSource.isLoading$.asObservable();

  selectAll: boolean = false;
  selectedProducts: Product['productId'][] = [];
  dataSource = new MatTableDataSource<IProduct>([]);
  queryOptions!: QueryOptions<IProduct>;
  fallbackQueryOptions: QueryOptions<IProduct> = {
    ...DEFAULT_QUERY_OPTIONS,
    sort: { field: 'createdAt', direction: 'desc' },
  };

  constructor(
    private productsService: ProductsApiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const updatedProducts :any = this.products.map(product => ({
      ...product,
      id: product.productId 
    }));
    if(!this.products) this.products = []
    this.dataSource.data = updatedProducts;
    this.data$ = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        return combineLatest([this.isLoading$, this.numberOfProduct$]).pipe(
          map(([isLoading, numberOfProduct]) => ({
            isLoading,
            numberOfProduct,
          })),
          catchError(() => {
            this.errorMessage = 'Error while compiling products data';
            return of({
              isLoading: false,
              numberOfProduct: 0,
            });
          })
        );
      }),
      catchError((error) => {
        this.errorMessage = error.message;
        this.cdr.detectChanges();
        return of();
      })
    );
  }

  getStoreByCategoty()
  {
    this.productsService
    .getStoreByProduct(this.storeDetails.storeId)
    .subscribe((response:any) => {
      this.dataSource = response.data[0].products;
    });
  }

  openProductModal(product?: IProduct) {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      id: 'add-product-modal',
      data: { product, ...this.storeDetails },
      // Note: Material dialog components are globally configured (see app.config.ts) to take up a maximum of 512px horizontally,
      //       but this modal have inputs (particularly product inputs) that would benefit from some extra space
      //       that's why it overrides the dialog width below to take up 600px.
      maxWidth: 600,
      minWidth: 600,
      minHeight: 740,
    });

    dialogRef
      .afterClosed()
      .pipe()
      .subscribe((result) => {
        if (result === undefined) {
        } else {
          if (product?.productId) {
            let newProductData = [...this.dataSource.data];
            const productIndex = newProductData.findIndex((item: any) => item.productId === product.productId);
            if (productIndex !== -1) {
              newProductData[productIndex] = result.data;
            } 
            this.dataSource.data = newProductData;
            this.cdr.detectChanges();
          } else {
                let newProductData = [...this.dataSource.data];               
                newProductData.push(result.data);
                this.dataSource.data = newProductData;
                this.cdr.detectChanges();
          }
        }
      });
  }

  openProductConfirmDeleteModal(product: IProduct) {
    const dialogRef = this.dialog.open(ProductConfirmDeleteModalComponent, {
      id: 'confirm-delete-product-modal',
      data: { product, ...this.storeDetails },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result === undefined) {
        } else {
          const newProductData = this.dataSource.data.filter(item => item.productId !== product.productId);
          this.dataSource.data = newProductData;
          this.table.clearRowSelection(product.productId);
          this.cdr.detectChanges();
        }
      });
  }

  openProductConfirmBulkDeleteModal(productToDeleteCount: number) {
    const dialogRef = this.dialog.open(ProductConfirmBulkDeleteModalComponent, {
      id: 'confirm-bulk-delete-product-modal',
      data: {
        ...this.storeDetails,
        productToDeleteCount,
        selectAll: this.selectAll,
        selectedProducts: this.selectedProducts,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result === undefined) {
        } else {
          const newProductData = this.dataSource.data.filter(item => !this.selectedProducts.includes(item.productId));
          this.dataSource.data = newProductData;
          this.cdr.detectChanges();
          this.table.clearRowSelection();
        }
      });
  }

  getSelectedProductsCount(totalProducts: number) {
    return this.selectAll
      ? totalProducts
      : this.selectedProducts.length;
  }

  handleAllRowsSelectedChange(value: boolean) {
    this.selectAll = value;
  }

  handleRowsSelectedChange(ids: Product['productId'][]) {
    this.selectedProducts = ids;
  }
}
