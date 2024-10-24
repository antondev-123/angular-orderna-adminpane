import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IFeedbackFilter, IFeedbackOverTime } from '../../model/feedback';
import { Maybe } from '../../../types/maybe';
import { FeedbacksApiService } from '../feedbacks/feedbacks-api.service';

@Injectable()
export class FeedbackAverageDataSource extends DataSource<IFeedbackOverTime> {
  feedbacks$ = new BehaviorSubject<IFeedbackOverTime[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private feedbacksSubscription: Maybe<Subscription>;

  constructor(private feedbacksService: FeedbacksApiService) {
    super();
  }

  connect(): Observable<IFeedbackOverTime[]> {
    return this.feedbacks$.asObservable();
  }

  disconnect(): void {
    this.feedbacks$.complete();
    this.feedbacksSubscription?.unsubscribe();
  }

  loadData(option: IFeedbackFilter): void {
    this.isLoading$.next(true);
    this.feedbacksSubscription?.unsubscribe();
    if (option.storeId === 'empty') {
      this.isLoading$.next(false);
      this.feedbacks$.next([]);
      return;
    }
    if (!option.dateRangeFilter) {
      this.isLoading$.next(false);
      this.feedbacks$.next([]);
      return;
    }

    this.feedbacksSubscription = this.feedbacksService
      .getFeedbacksOverTime(option)
      .subscribe((feedbacksOverviewData) => {
        console.log('loadFeedbacksChartData', feedbacksOverviewData);
        this.isLoading$.next(false);
        this.feedbacks$.next(feedbacksOverviewData ?? []);
      });
  }
}
