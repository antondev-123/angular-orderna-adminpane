import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import {
  SubscriptionPlan,
  SubscriptionPlanUpdateData,
  ISubscriptionPlan,
} from '../../model/subscription-plan';
import { IUserProfile } from '../../model/user-profile';

export interface ISubscriptionPlansApiService {
  getSubscriptionPlan(
    profileId: IUserProfile['id']
  ): Observable<Maybe<SubscriptionPlan>>;
  updateSubscriptionPlan(
    subscriptionPlan: SubscriptionPlanUpdateData
  ): Observable<Maybe<ISubscriptionPlan>>;
}
