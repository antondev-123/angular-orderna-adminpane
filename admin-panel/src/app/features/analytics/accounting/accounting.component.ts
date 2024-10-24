import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { InputFilterImmediateComponent } from '../../../shared/components/input/filter-immediate/filter-immediate.component';
import {
  ActivatedRoute,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import { InputDateRangeComponent } from '../../../shared/components/input/daterange/daterange.component';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { TableComponent } from '../../../shared/components/table/table.component';
import { TableSkeletonComponent } from '../../../shared/components/table/table-skeleton.component';
import { RowControlComponent } from '../../../shared/components/row-controls/row-controls.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { DailySummaryComponent } from './tabs/daily-summary/daily-summary.component';
import { AllTransactionsComponent } from './tabs/all-transactions/all-transactions.component';
import { TransactionStatus } from '../../../model/enum/transaction-status';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    InputFilterImmediateComponent,
    InputDateRangeComponent,

    TableComponent,
    TableSkeletonComponent,
    RowControlComponent,
    PaginationComponent,

    DailySummaryComponent,
    AllTransactionsComponent,
  ],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.css',
})
export class AccountingComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  lastStatus = signal<TransactionStatus | 'all'>(this.status ?? 'all');

  get status() {
    return this.route.snapshot.queryParams['status'];
  }

  get dateFilter() {
    return this.route.snapshot.queryParams['dateFilter'];
  }

  constructor(private dateAdapter: DateAdapter<Date>) {
    if (!this.dateFilter) {
      this.updateQueryParams({
        dateFilter: `${this.dateAdapter.format(
          new Date(),
          'shortDate'
        )}_${this.dateAdapter.format(new Date(), 'shortDate')}`,
      });
    }
  }

  changeTab(tab: number) {
    const queryParams = { ...this.route.snapshot.queryParams };

    if (tab === 0) {
      queryParams['status'] = undefined;
    } else if (tab === 1 && !queryParams['status']) {
      queryParams['status'] = this.lastStatus();
    }

    this.updateQueryParams(queryParams);
  }

  updateQueryParams(
    updatedParams: Maybe<Params>,
    handling: QueryParamsHandling = 'merge'
  ) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: handling,
      queryParams: updatedParams,
      replaceUrl: true, // adds new history to URL
    });
  }
}
