import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import { IUserProfile } from '../../model/user-profile';
import {
  IFeedback,
  FeedbackUpdateData,
  IFeedbackFilter,
  IFeedbackOverTime,
  IFeedbackAverage,
} from '../../model/feedback';

export interface IFeedbacksApiService {
  getFeedback(profileId: IUserProfile['id']): Observable<Maybe<IFeedback>>;
  updateFeedback(feedback: FeedbackUpdateData): Observable<Maybe<IFeedback>>;
  getFeedbacks(): Observable<Maybe<IFeedback[]>>;
  getFeedbacksOverTime(
    options: IFeedbackFilter
  ): Observable<Maybe<IFeedbackOverTime[]>>;
  getFeedbackAverage(
    options: IFeedbackFilter
  ): Observable<Maybe<IFeedbackAverage>>;
}
