import { SubscriptionPlanType } from './enum/subscription-plan-type';
import { UserProfile } from './user-profile';

export interface ISubscriptionPlan {
  id: number;
  profile: UserProfile;
  subscriptionPlan: SubscriptionPlanType;
}

export type SubscriptionPlanUpdateData = Omit<ISubscriptionPlan, 'profile'>;

export class SubscriptionPlan implements ISubscriptionPlan {
  id: number;
  profile: UserProfile;
  subscriptionPlan: SubscriptionPlanType;

  constructor({
    id = 0,
    profile = new UserProfile({}),
    subscriptionPlan = SubscriptionPlanType.BASIC,
  }: Partial<SubscriptionPlan>) {
    this.id = id;
    this.profile = profile;
    this.subscriptionPlan = subscriptionPlan;
  }
}
