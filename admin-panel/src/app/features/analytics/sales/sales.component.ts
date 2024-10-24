import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  ActivatedRoute,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { RevenueComponent } from './tabs/revenue/revenue.component';
import { ZReportComponent } from './tabs/z-report/z-report.component';
import { AverageOrderValueComponent } from './tabs/average-order-value/average-order-value.component';
import { DayOfWeekComponent } from './tabs/day-of-week/day-of-week.component';
import { TimeOfDayComponent } from './tabs/time-of-day/time-of-day.component';
import { SaleByProductsComponent } from './tabs/sale-by-products/sale-by-products.component';
import { SaleByCategoriesComponent } from './tabs/sale-by-categories/sale-by-categories.component';
import { TipsByDayComponent } from './tabs/tips-by-day/tips-by-day.component';
import { DiscountSummariesComponent } from './tabs/discount-summaries/discount-summaries.component';
import { FailedTransactionComponent } from './tabs/failed-transactions/failed-transactions.component';
import { DiscountedTransactionComponent } from './tabs/discounted-transactions/discounted-transactions.component';
import { RefundedTransactionComponent } from './tabs/refunded-transactions/refunded-transactions.component';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,

    RevenueComponent,
    ZReportComponent,
    AverageOrderValueComponent,
    DayOfWeekComponent,
    TimeOfDayComponent,
    SaleByProductsComponent,
    SaleByCategoriesComponent,
    TipsByDayComponent,
    DiscountSummariesComponent,
    DiscountedTransactionComponent,
    RefundedTransactionComponent,
    FailedTransactionComponent,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent {
  selectedTab: number = 0;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  constructor() {
    this.updateQueryParams({
      status: null,
      store: null,
      dateFilter: null,
      perPage: null,
    });
  }

  changeTab(tab: number) {
    this.updateQueryParams({
      status: null,
      store: null,
      dateFilter: null,
      perPage: null,
    });

    this.selectedTab = tab;
  }

  updateQueryParams(
    updatedParams: Maybe<Params>,
    handling: QueryParamsHandling = 'merge'
  ) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedParams,
      queryParamsHandling: handling,
      replaceUrl: false, // adds new history to URL
    });
  }
}
