import { UserProfile } from './user-profile';
import { DateGroup } from '../../types/date-group';
import { FilterOptionItem } from '../../types/filter';
import { IStore, Store } from './store';

export interface IFeedback {
  id: number;
  profile: UserProfile;
  store: Store;
  rating: number;
  feedbackComment: string;
  createdAt: Date;
}

export type FeedbackUpdateData = Pick<
  IFeedback,
  'id' | 'rating' | 'feedbackComment'
>;

export class Feedback implements IFeedback {
  id: number;
  profile: UserProfile;
  store: Store;
  rating: number;
  feedbackComment: string;
  createdAt: Date;

  constructor({
    id,
    profile,
    rating,
    feedbackComment = '',
    store,
    createdAt,
  }: Feedback) {
    this.id = id;
    this.profile = profile;
    this.rating = rating;
    this.feedbackComment = feedbackComment;
    this.createdAt = createdAt;
    this.store = store;
  }
}

export interface IFeedbackAverage {
  averageRating: number;
  feedbackPercentage: number;
}

export interface IFeedbackOverTime {
  id: number;
  createdAt: Date;
  average: number;
  total: number;
  rating?: number;
  groupedValues?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface IFeedbackFilterState extends IFeedbackFilter {
  isLoading: boolean;
  storeFilterOptions: FilterOptionItem<IStore['id'] | 'empty'>[];
}

export interface IFeedbackFilter {
  storeId?: IStore['id'] | 'empty';
  dateRangeFilter?: {
    from?: Date | undefined;
    to?: Date | undefined;
  };
  dateGroup?: DateGroup;
}
