import { Component, OnInit } from '@angular/core';
import {
  DashboardHeaderComponent,
  IDashboardFilter,
} from './dashboard-header/dashboard-header.component';
import { BehaviorSubject } from 'rxjs';
import { DashboardSalesComponent } from './dashboard-sales/dashboard-sales.component';
import { DashboardBestSellersComponent } from './dashboard-best-sellers/dashboard-best-sellers.component';
import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { DashboardRequestComponent } from './dashboard-request/dashboard-request.component';
import { DashboardStoreCompareComponent } from './dashboard-store-compare/dashboard-store-compare.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardHeaderComponent,
    DashboardSalesComponent,
    DashboardBestSellersComponent,
    DashboardOverviewComponent,
    DashboardRequestComponent,
    DashboardStoreCompareComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  // userCount: any = '';
  // productCount: any = '';
  // transactionCount: any = '';

  constructor() {} // private adminService: AdminService

  dashboardFilter: BehaviorSubject<IDashboardFilter> =
    new BehaviorSubject<IDashboardFilter>({
      storeId: 'empty',
      startDate: new Date(),
      endDate: new Date(),
    });

  ngOnInit(): void {
    // this.numberOfUsers();
    // this.numberOfProducts();
    // this.numberOfTransactions();
  }

  numberOfUsers() {
    // this.adminService.numberOfUsers().subscribe({
    //   next: (data) => {
    //     this.userCount = data.response;
    //   },
    // });
  }

  numberOfProducts() {
    // this.adminService.numberOfProducts().subscribe({
    //   next: (data) => {
    //     this.productCount = data.response;
    //   },
    // });
  }

  numberOfTransactions() {
    // this.adminService.numberOfTransactions().subscribe({
    //   next: (data) => {
    //     this.transactionCount = data.response;
    //   },
    // });
  }

  filterUpdated(filter: IDashboardFilter) {
    this.dashboardFilter?.next(filter);
  }
}
