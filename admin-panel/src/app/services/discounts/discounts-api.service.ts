import { inject, Injectable } from '@angular/core';
import { IDiscountsApiService } from './discounts-api.interface';
import { HttpClient } from '@angular/common/http';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { BehaviorSubject, Observable } from 'rxjs';

import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import {
  IDiscountDetail,
  DiscountDetail,
  IDiscountCreateData,
  IDiscountSummary,
  IDiscountUpdateData,
  DiscountTotalRedeemedAmountOverTimeChartData,
} from '../../model/discount';
import { Data } from '@orderna/admin-panel/src/utils/service';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class DiscountsApiService implements IDiscountsApiService {
  private http = inject(HttpClient);

  data = {
    discounts: {
      items: [],
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
    return this.http.put(API_URL + 'discount-create', JSON.stringify(discount));
  }

  updateDiscount(discount: IDiscountUpdateData): Observable<any> {
    return this.http.put(API_URL + 'discount-update', JSON.stringify(discount));
  }

  deleteDiscount(discountId: IDiscountSummary['id']): Observable<any> {
    return this.http.post(API_URL + 'discount-delete', discountId);
  }

  deleteDiscounts(discountsIds: IDiscountSummary['id'][]): Observable<any> {
    return this.http.post(API_URL + 'discount-delete-some', discountsIds);
  }

  deleteAllDiscounts(): Observable<any> {
    return this.http.delete(API_URL + 'discount-delete-all');
  }

  deleteAllDiscountsExcept(
    discountIds: IDiscountSummary['id'][]
  ): Observable<any> {
    return this.http.post(API_URL + 'discount-delete-all-except', discountIds);
  }

  getDiscount(discountId: IDiscountDetail['id']): Observable<any> {
    return this.http.get(API_URL + `discounts/${discountId}`);
  }

  getDiscounts(_options: QueryOptions<IDiscountSummary>): Observable<any> {
    return this.http.get(API_URL + 'discounts');
  }

  getTotalDiscounts(): Observable<any> {
    return this.http.get(API_URL + 'discounts-number');
  }

  getDiscountTotalRedeemedAmountOverTimeChartData(
    discountId: IDiscountDetail['id']
  ): Observable<DiscountTotalRedeemedAmountOverTimeChartData> {
    return this.http.get<DiscountTotalRedeemedAmountOverTimeChartData>(
      API_URL + `discounts/${discountId}/total-redeemed-amount-over-time`
    );
  }
}
