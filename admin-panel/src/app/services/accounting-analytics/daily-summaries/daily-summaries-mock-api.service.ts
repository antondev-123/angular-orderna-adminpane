import { inject, Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Data, getTotalItems } from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, delay, map, Observable } from 'rxjs';
import { IDailySummariesApiService } from './daily-summaries-api.interface';
import { DateAdapter } from '@angular/material/core';
import { TransactionItem } from '../../../model/transaction-item';
import { TRANSACTION_ITEMS } from '../../../data/transaction-items';
import { TRANSACTIONS } from '../../../data/transactions';
import { DailySummary, IDailySummary } from '../../../model/daily-summary';

@Injectable({
  providedIn: 'root',
})
export class DailySummariesMockApiService implements IDailySummariesApiService {
  private transactionItems: TransactionItem[] = [...TRANSACTION_ITEMS];
  private dateAdapter = inject(DateAdapter<Date>);

  data = {
    daily_summaries: {
      items: [] as DailySummary[],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IDailySummary>,
      subject: new BehaviorSubject<Maybe<DailySummary[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };
  get dailySummariesData() {
    return this.data['daily_summaries'] as Data<DailySummary, IDailySummary>;
  }

  getDailySummaries(
    options: QueryOptions<IDailySummary>
  ): Observable<Maybe<IDailySummary[]>> {
    let startDate: Date = new Date();
    let endDate: Date = new Date();

    startDate.setHours(0, 0, 0, 0);

    this.dailySummariesData.queryOptions = options ?? { page: 1, perPage: 10 };

    if (options.dateFilter) {
      const [start, end] = options.dateFilter.split('_');
      startDate = new Date(start);
      endDate = new Date(end);
    }

    const storeFilter = options.filters?.find((f) => f.field === 'store');

    const data: DailySummary[] = [];

    const filteredTransactions = TRANSACTIONS.filter(
      (t) =>
        // Filter transactions within 'startDate' to 'endDate'
        t.transactionDate >= startDate &&
        t.transactionDate <= endDate &&
        // Filter transactions by store
        !!storeFilter &&
        storeFilter?.value.includes(`${t.store.id}`)
    );
    const filteredTransactionIds = filteredTransactions.map((t) => t.id);
    const filteredTransactionItems = this.transactionItems.filter((t) =>
      filteredTransactionIds.includes(t.transactionId)
    );

    let count = 1;

    // Compute revenue, cost, fees, etc. data for each day from 'startDate' to 'endDate'
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Get transactions on current date
      const currentTransactions = filteredTransactions.filter(
        (t) => this.dateAdapter.compareDate(t.transactionDate, startDate) === 0
      );
      const currentTransactionIds = currentTransactions.map((t) => t.id);
      const currentTransactionItems = filteredTransactionItems.filter((t) =>
        currentTransactionIds.includes(t.transactionId)
      );

      const revenue = currentTransactionItems
        .map((t) => t.product.price * t.quantity)
        .reduce((acc, value) => acc + value, 0);

      const cost = currentTransactionItems
        .map((t) => t.product.cost * t.quantity)
        .reduce((acc, value) => acc + value, 0);

      const fees = currentTransactions
        .map((t) => t.service)
        .reduce((acc, value) => acc + value, 0);

      const tips = currentTransactions.filter((t) => t.tip ?? 0 > 0).length;
      const tipsAmount = currentTransactions
        .filter((t) => t.tip ?? 0 > 0)
        .map((t) => t.tip ?? 0)
        .reduce((acc, value) => acc + value, 0);

      const refunds = currentTransactionItems.filter(
        (t) => t.wasRefunded
      ).length;

      const refundsAmount = currentTransactionItems
        .filter((t) => t.wasRefunded)
        .map((t) => t.product.price * t.quantity)
        .reduce((acc, value) => acc + value, 0);

      const taxAmount = currentTransactions
        .map((t) => t.tax)
        .reduce((acc, value) => acc + value, 0);

      data.push({
        id: count,
        date: currentDate,
        transactions: currentTransactions.length,
        revenue,
        costOfGoods: cost,
        grossProfit: revenue - cost,
        margin: (revenue - cost) / revenue,
        fees,
        tips,
        tipsAmount,
        refunds,
        refundsAmount,
        taxAmount,
        netRevenue: revenue - cost + fees - (tips + refunds + taxAmount),
      });
      count++;
      currentDate = this.dateAdapter.addCalendarDays(currentDate, 1);
    }

    const { page, perPage, sort } = this.dailySummariesData.queryOptions;

    // Apply sorting if provided
    if (sort) {
      const sortFactor = sort.direction === 'asc' ? 1 : -1;

      data.sort((a, b) => {
        const aValue = a[sort.field as keyof IDailySummary];
        const bValue = b[sort.field as keyof IDailySummary];

        // If values are the same, return 0
        if (aValue === bValue) {
          return 0;
        }

        // If any value is undefined or null, push it to the end (or the beginning, based on sort direction)
        if (aValue == null) {
          return -sortFactor;
        }
        if (bValue == null) {
          return sortFactor;
        }

        // Handle different types: number, string, Date
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortFactor * (aValue - bValue); // Sort by numerical comparison
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          return sortFactor * (aValue.getTime() - bValue.getTime()); // Sort by date comparison
        }

        // If types do not match, fall back to string comparison to avoid errors
        return sortFactor * aValue.toString().localeCompare(bValue.toString());
      });
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;

    this.dailySummariesData.totalSubject.next(data.length);
    this.dailySummariesData.subject.next(data.slice(start, end));

    return this.dailySummariesData.subject.asObservable().pipe(delay(1000));
  }

  getTotalDailySummaries(): Observable<Maybe<number>> {
    return getTotalItems(this.dailySummariesData);
  }

  getComputedDailySummaries(): Observable<Maybe<DailySummary>> {
    return this.dailySummariesData.subject.asObservable().pipe(
      map((dailySummaries) => {
        return new DailySummary(
          0,
          new Date(),
          dailySummaries
            ?.map((d) => d.transactions)
            .reduce((acc, d) => acc + d, 0),
          dailySummaries?.map((d) => d.revenue).reduce((acc, d) => acc + d, 0),
          dailySummaries
            ?.map((d) => d.costOfGoods)
            .reduce((acc, d) => acc + d, 0),
          dailySummaries
            ?.map((d) => d.grossProfit)
            .reduce((acc, d) => acc + d, 0),
          dailySummaries?.map((d) => d.margin).reduce((acc, d) => acc + d, 0),
          dailySummaries?.map((d) => d.fees).reduce((acc, d) => acc + d, 0),
          dailySummaries?.map((d) => d.tips).reduce((acc, d) => acc + d, 0),
          dailySummaries
            ?.map((d) => d.tipsAmount)
            .reduce((acc, d) => acc + d, 0),
          dailySummaries?.map((d) => d.refunds).reduce((acc, d) => acc + d, 0),
          dailySummaries
            ?.map((d) => d.refundsAmount)
            .reduce((acc, d) => acc + d, 0),
          dailySummaries
            ?.map((d) => d.taxAmount)
            .reduce((acc, d) => acc + d, 0),
          dailySummaries
            ?.map((d) => d.netRevenue)
            .reduce((acc, d) => acc + d, 0)
        );
      })
    );
  }
}
