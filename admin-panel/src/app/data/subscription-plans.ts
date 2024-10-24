import { getRandomEnumValue } from '../../utils/dummy-data';
import { SubscriptionPlanType } from '../model/enum/subscription-plan-type';
import { SubscriptionPlan } from '../model/subscription-plan';
import { USER_PROFILES } from './user-profiles';

export const SUBSCRIPTION_PLANS = USER_PROFILES.reduce(
  (acc: SubscriptionPlan[], profile) => {
    acc.push({
      id: profile.id,
      profile,
      subscriptionPlan: getRandomEnumValue(SubscriptionPlanType),
    });
    return acc;
  },
  []
);
