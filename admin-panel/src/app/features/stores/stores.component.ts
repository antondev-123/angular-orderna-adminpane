import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  ButtonTextDirective,
  ButtonComponent,
} from '../../shared/components/button/button.component';
import { InputSearchComponent } from '../../shared/components/input/search/search.component';
import { PaginationStoreViewComponent } from '../../shared/components/pagination-store-view/pagination-store-view.component';
import { Store } from '../../model/store';
import { StoresApiService } from '../../core/stores/stores-api.service';
import { MatIconModule } from '@angular/material/icon';
import { StoreCardsSkeletonComponent } from './store-cards-skeleton/store-cards-skeleton.component';
import { combineLatest, map, Observable, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

interface PageData {
  currentPage: number;
  totalStores: number | null;
  stores: Store[] | null;
}
@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [
    MatInputModule,
    MatIconModule,
    MatButtonModule,

    CommonModule,
    RouterModule,

    ButtonComponent,
    ButtonTextDirective,
    PaginationStoreViewComponent,
    InputSearchComponent,
    StoreCardsSkeletonComponent,
  ],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss',
})
export class StoresComponent {
  pageSize: number = 12;
  pageIndex : number = 0;
  length : number = 0;

  searchTerm = signal<string>('');

  searchTerm$ = toObservable(this.searchTerm);
  currentPage$ = this.route.queryParams.pipe(
    map((params) => +params['page'] || 1)
  );
  data$: Observable<PageData> = combineLatest([
    this.currentPage$,
    this.searchTerm$,
  ]).pipe(
    switchMap(([currentPage, searchTerm]) => 
      this.fetchStores(currentPage, searchTerm)
    )
  );

  data = toSignal<PageData>(this.data$);

  currentPage = signal<number>(1); // Initial page set to 1
  stores = computed<Store[] | null>(() => this.data()?.stores ?? null);
  totalStores = computed<number | null>(() => this.data()?.totalStores ?? 1);  
  numberOfPages = computed(() =>
    Math.ceil((this.data()?.totalStores ?? 0) / this.pageSize)
  );
  constructor(
    private storeService: StoresApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  goToAddStorePage() {
    this.router.navigate(['stores/create']);
  }

  getStoreEditLink(slug: Store['id']): any {
    return `/stores/${slug}/edit`;
  }

  getStoreItemsEditLink(id: Store['id']): string {
    return `/products/edit/${id}`;
  }

  fetchStores(currentPage: number,searchTerm?: string): Observable<PageData> {
    return this.storeService.getStores(this.pageSize, currentPage, searchTerm || '').pipe( // Use currentPage instead of pageIndex
      map((result:any) =>({
          currentPage,
          stores: result.data.store,
          totalStores: result.data.total_record,
        }))
    );
  }
  searchStores(currentPage: number, searchTerm: string) {
    // TODO: searchStores service should accept 'page'
    return this.storeService.searchStores(searchTerm).pipe(
      map((result) => ({
        currentPage,
        stores: result,
        totalStores: result.length,
      }))
    );
  }

  getRouterLink(storeName: string): string {
    return `/stores/${storeName.replace(/ /g, '-')}/shop`;
  }

  onPageChange(page: any) {
    this.currentPage.set(page);
    this.updateQueryParams();
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage() },
      queryParamsHandling: 'merge',
    });
  }

  // TODO: Add debounce
  handleSearch(searchTerm: string) {
    this.searchTerm.set(searchTerm.toLowerCase().trim());
  }
}
