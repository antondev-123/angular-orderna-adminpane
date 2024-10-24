import { Component, Input, OnInit } from '@angular/core';
import { DashboardTopSalesDataSource } from '../../../services/data-sources/dashboard-top-sales.dataSource';
import { TableColumn } from '../../../../types/table';
import { ITopSoldProduct, ITopSoldProductKeys } from '../../../model/product';
import { TableComponent } from '../../../shared/components/table/table.component';
import { BehaviorSubject } from 'rxjs';
import { IDashboardFilter } from '../dashboard-header/dashboard-header.component';
import { SalesApiService } from '../../../services/sales/sales-api.service';

@Component({
  selector: 'app-dashboard-best-sellers',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './dashboard-best-sellers.component.html',
  styleUrl: './dashboard-best-sellers.component.css',
})
export class DashboardBestSellersComponent implements OnInit {
  @Input() dashboardFilter!: BehaviorSubject<IDashboardFilter>;

  constructor(private salesService: SalesApiService) {}

  topSoldProductDataSource = new DashboardTopSalesDataSource(this.salesService);
  topSoldProductTableData$ =
    this.topSoldProductDataSource.topSoldProducts$.asObservable();

  errorMessage?: string;
  infoMessage?: string;

  readonly columns: TableColumn<ITopSoldProduct>[] = [
    { key: 'productName', label: 'Product', type: 'string' },
    { key: 'totalSold', label: 'Units sold', type: 'number' },
    {
      key: 'totalRevenue',
      label: 'Revenue',
      type: 'number',
      getValue: (topSold) => `${topSold.totalRevenue} ₱`,
    },
  ];

  ngOnInit(): void {
    this.dashboardFilter.subscribe((filter) => {
      this.errorMessage = undefined;

      if (!filter || filter.storeId === 'empty' || filter.storeId === null) {
        this.infoMessage = 'Please select a store';
        this.topSoldProductDataSource.resetBestSellers();
        return;
      }

      this.topSoldProductDataSource.loadTotalSales(filter);
    });
  }

  handleSort(
    event: { field: ITopSoldProductKeys; direction: 'asc' | 'desc' } | undefined
  ) {
    this.topSoldProductDataSource.sortTotalSales(
      event?.field,
      event?.direction
    );
  }
}
