import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  getItem,
  updateItem,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserProfile } from '../../model/user-profile';
import { ISubscriptionPlansApiService } from './subscription-plans-api.interface';
import { SUBSCRIPTION_PLANS } from '../../data/subscription-plans';
import {
  ISubscriptionPlan,
  SubscriptionPlan,
  SubscriptionPlanUpdateData,
} from '../../model/subscription-plan';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPlansMockApiService
  implements ISubscriptionPlansApiService
{
  data = {
    subscription_plans: {
      items: [...SUBSCRIPTION_PLANS],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<ISubscriptionPlan>,
      subject: new BehaviorSubject<Maybe<SubscriptionPlan[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get subscriptionPlansData() {
    return this.data['subscription_plans'] as Data<
      SubscriptionPlan,
      ISubscriptionPlan
    >;
  }

  getSubscriptionPlan(
    profileId: IUserProfile['id']
  ): Observable<Maybe<SubscriptionPlan>> {
    return getItem(this.subscriptionPlansData, profileId);
  }

  updateSubscriptionPlan(
    subscriptionPlan: SubscriptionPlanUpdateData
  ): Observable<any> {
    return updateItem(this.subscriptionPlansData, subscriptionPlan);
  }
}
