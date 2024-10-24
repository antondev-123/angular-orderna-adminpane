import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ShopCategoryComponent } from './shop-category/shop-category.component';
import { ShopSidebarSummaryComponent } from './shop-sidebar-summary/shop-sidebar-summary.component';
import { StoresApiService } from '@orderna/admin-panel/src/app/core/stores/stores-api.service';
import { ActivatedRoute } from '@angular/router';
import { InputSearchComponent } from '../../../shared/components/input/search/search.component';
import { ICategory } from '../../../model/category';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    InputSearchComponent,
    ShopSidebarSummaryComponent,
    ShopCategoryComponent,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  activeLink: string | number = '1'; // Adjust type to accept both string and number
  categories: ICategory[] = []; // Define categories array to hold the fetched categories

  constructor(
    private activatedRoute: ActivatedRoute,
    private storeService: StoresApiService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    // this.logRouteInformation();
  }
  private logRouteInformation(): void {
    console.log('Current Route:', this.activatedRoute.snapshot.routeConfig);
    console.log(
      'Parent Route:',
      this.activatedRoute.parent?.snapshot.routeConfig
    );
  }

  loadCategories(): void {
    this.storeService.getCategories().subscribe(
      (categories: ICategory[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  scrollTo(sectionId: number): void {
    const element = document.getElementById(sectionId.toString());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.activeLink = sectionId;
    }
  }
}
