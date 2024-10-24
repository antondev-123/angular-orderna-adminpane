import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { Observable } from 'rxjs';
import {
  IDiscountCreateData,
  IDiscountUpdateData,
  IDiscountSummary,
  IDiscountDetail,
  DiscountDetail,
  DiscountTotalRedeemedAmountOverTimeChartData,
} from '../../model/discount';
import { Data } from '@orderna/admin-panel/src/utils/service';

export interface IDiscountsApiService {
  discountsData: Data<DiscountDetail, IDiscountDetail>;

  createDiscount(
    discount: IDiscountCreateData
  ): Observable<IDiscountCreateData>;
  updateDiscount(
    discount: IDiscountUpdateData
  ): Observable<IDiscountUpdateData>;
  deleteDiscount(
    discountId: IDiscountSummary['id']
  ): Observable<IDiscountSummary>;
  deleteDiscounts(
    discountIds: IDiscountSummary['id'][]
  ): Observable<IDiscountSummary[]>;
  deleteAllDiscounts(): Observable<IDiscountSummary[]>;
  deleteAllDiscountsExcept(
    discountIds: IDiscountSummary['id'][]
  ): Observable<IDiscountSummary[]>;
  getDiscount(
    customerId: IDiscountDetail['id']
  ): Observable<Maybe<DiscountDetail>>;
  getDiscounts(
    option: QueryOptions<IDiscountDetail>
  ): Observable<Maybe<DiscountDetail[]>>;
  getTotalDiscounts(): Observable<Maybe<number>>;
  getDiscountTotalRedeemedAmountOverTimeChartData(
    discountId: IDiscountDetail['id']
  ): Observable<DiscountTotalRedeemedAmountOverTimeChartData>;
}
