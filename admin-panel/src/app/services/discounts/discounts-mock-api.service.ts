import { Injectable } from '@angular/core';
import { IDiscountsApiService } from './discounts-api.interface';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  createItem,
  Data,
  deleteAllItems,
  deleteAllItemsExcept,
  deleteItem,
  deleteItems,
  filterItems,
  getItem,
  getTotalItems,
  updateItem,
} from '@orderna/admin-panel/src/utils/service';
import { DISCOUNTS } from '../../data/discounts';
import {
  IDiscountDetail,
  DiscountDetail,
  IDiscountCreateData,
  IDiscountUpdateData,
  DiscountSummary,
  IDiscountSummary,
  DiscountTotalRedeemedAmountOverTimeChartData,
} from '../../model/discount';
import { DiscountStatus } from '../../model/enum/discount-status';

@Injectable({
  providedIn: 'root',
})
export class DiscountsMockApiService implements IDiscountsApiService {
  data = {
    discounts: {
      items: [...DISCOUNTS],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IDiscountDetail>,
      subject: new BehaviorSubject<Maybe<DiscountDetail[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get discountsData() {
    return this.data['discounts'] as Data<DiscountDetail, IDiscountDetail>;
  }

  createDiscount(discount: IDiscountCreateData): Observable<any> {
    const now = new Date();
    const newDiscount = DiscountDetail.fromJSON({
      ...discount,
      id: this.discountsData.items.length + 1,
      createdAt: now,
      updatedAt: now,
      status: this.getDiscountStatus(
        discount.validFrom ?? now,
        discount.validThrough ?? null
      ),

      // TODO: Get data from transactions dummy data
      redemptionsCount: 0,
    });
    return createItem(this.discountsData, newDiscount);
  }

  updateDiscount(discount: IDiscountUpdateData): Observable<any> {
    return updateItem(this.discountsData, discount);
  }

  deleteDiscount(
    discountId: DiscountSummary['id']
  ): Observable<IDiscountSummary> {
    return deleteItem(this.discountsData, discountId);
  }

  deleteDiscounts(
    discountIds: DiscountSummary['id'][]
  ): Observable<IDiscountSummary[]> {
    return deleteItems(this.discountsData, discountIds);
  }

  deleteAllDiscounts(): Observable<IDiscountSummary[]> {
    return deleteAllItems(this.discountsData);
  }

  deleteAllDiscountsExcept(
    discountIds: DiscountSummary['id'][]
  ): Observable<IDiscountSummary[]> {
    return deleteAllItemsExcept(this.discountsData, discountIds);
  }

  getDiscount(discountId: IDiscountDetail['id']): Observable<any> {
    return getItem(this.discountsData, discountId);
  }

  getDiscounts(
    options: QueryOptions<IDiscountSummary>
  ): Observable<Maybe<DiscountDetail[]>> {
    const andFilterByStore = (item: IDiscountDetail) => {
      const storeFilter = options.filters?.find((f) => f.field === 'store');
      if (!storeFilter) return true;

      return item.applicableStores.includes(+storeFilter.value);
    };
    return filterItems(this.discountsData, options, andFilterByStore);
  }

  getTotalDiscounts(): Observable<Maybe<number>> {
    return getTotalItems(this.discountsData);
  }

  private getDiscountStatus(validFrom: Date, validThrough: Date | null) {
    const now = new Date();

    // Check if the current date falls within the valid range
    if (now >= validFrom && (validThrough === null || now <= validThrough)) {
      return DiscountStatus.ACTIVE;
    }

    // Check if the valid range is in the future
    if (now < validFrom) {
      return DiscountStatus.SCHEDULED;
    }

    // Check if the valid range is in the past
    if (validThrough !== null && now > validThrough) {
      return DiscountStatus.EXPIRED;
    }

    // If validThrough is null, it implies an open-ended period, so no expiration
    return DiscountStatus.ACTIVE;
  }

  getDiscountTotalRedeemedAmountOverTimeChartData(
    discountId: IDiscountDetail['id']
  ): Observable<DiscountTotalRedeemedAmountOverTimeChartData> {
    return of([
      {
        period: new Date('2024-01-01'),
        totalRedeemedAmount: 1500,
      },
      {
        period: new Date('2024-01-02'),
        totalRedeemedAmount: 1700,
      },
      {
        period: new Date('2024-01-03'),
        totalRedeemedAmount: 1600,
      },
      {
        period: new Date('2024-01-04'),
        totalRedeemedAmount: 1800,
      },
      {
        period: new Date('2024-01-05'),
        totalRedeemedAmount: 2000,
      },
    ]);
  }
}
