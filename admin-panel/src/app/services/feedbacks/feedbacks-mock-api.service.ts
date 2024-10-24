import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  filterItems,
  getItem,
  updateItem,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IFeedbacksApiService } from './feedbacks-api.interface';
import { DateGroup } from '@orderna/admin-panel/src/types/date-group';
import {
  areDatesEqual,
  groupFeedbackOverview,
} from '@orderna/admin-panel/src/utils/dummy-data';
import { FEEDBACKS } from '../../data/feedback';
import {
  IFeedback,
  Feedback,
  FeedbackUpdateData,
  IFeedbackFilter,
  IFeedbackOverTime,
  IFeedbackAverage,
} from '../../model/feedback';
import { IUser } from '../../model/user';

@Injectable({
  providedIn: 'root',
})
export class FeedbacksMockApiService implements IFeedbacksApiService {
  data = {
    feedbacks: {
      items: [...FEEDBACKS],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IFeedback>,
      subject: new BehaviorSubject<Maybe<Feedback[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get feedbacksData() {
    return this.data['feedbacks'] as Data<Feedback, IFeedback>;
  }

  getFeedback(profileId: IUser['id']): Observable<Maybe<IFeedback>> {
    return getItem(this.feedbacksData, profileId);
  }
  updateFeedback(feedback: FeedbackUpdateData): Observable<Maybe<IFeedback>> {
    return updateItem(this.feedbacksData, feedback);
  }
  getFeedbacks(): Observable<Maybe<IFeedback[]>> {
    return filterItems(this.feedbacksData);
  }
  getFeedbacksOverTime(
    option: IFeedbackFilter
  ): Observable<IFeedbackOverTime[]> {
    const foundFeedbacks = FEEDBACKS.filter((f) => {
      const isFound =
        f.createdAt <= (option.dateRangeFilter?.to ?? Infinity) &&
        f.createdAt >= (option.dateRangeFilter?.from ?? -Infinity);
      return isFound && f.store.id === option.storeId;
    })
      .reduce((acc, f) => {
        const sameDateFeedback = acc.find((a) =>
          areDatesEqual(a.createdAt, f.createdAt)
        );

        if (sameDateFeedback) {
          sameDateFeedback.rating ? (sameDateFeedback.rating += f.rating) : 0;
          sameDateFeedback.total++;
        } else {
          acc.push({
            id: f.id,
            createdAt: f.createdAt,
            average: 0,
            rating: f.rating ?? 0,
            total: 1,
          });
        }

        return acc;
      }, [] as IFeedbackOverTime[])
      .map((f) => ({
        ...f,
        average: parseFloat((f.rating! / f.total).toFixed(2)),
      }))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (
      option.dateGroup === DateGroup.WEEK ||
      option.dateGroup === DateGroup.MONTH ||
      option.dateGroup === DateGroup.YEAR
    ) {
      return of(groupFeedbackOverview(foundFeedbacks, option.dateGroup));
    }

    return of(foundFeedbacks);
  }

  getFeedbackAverage(
    option: IFeedbackFilter
  ): Observable<Maybe<IFeedbackAverage>> {
    const foundFeedbacks = FEEDBACKS.filter((f) => {
      const isFound =
        f.createdAt <= (option.dateRangeFilter?.to ?? Infinity) &&
        f.createdAt >= (option.dateRangeFilter?.from ?? -Infinity);
      return isFound && f.store.id === option.storeId;
    });
    let averageRating = parseFloat(
      (
        foundFeedbacks.reduce((acc, f) => acc + f.rating, 0) /
        foundFeedbacks.length
      ).toFixed(2)
    );
    isNaN(averageRating) ? (averageRating = 0) : averageRating;
    const feedbackPercentage = parseFloat(
      ((foundFeedbacks.length / FEEDBACKS.length) * 100).toFixed(2)
    );
    return of({
      averageRating,
      feedbackPercentage,
    });
  }
}
