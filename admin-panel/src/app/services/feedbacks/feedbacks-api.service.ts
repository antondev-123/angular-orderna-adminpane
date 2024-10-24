import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserProfile } from '../../model/user-profile';
import { IFeedbacksApiService } from './feedbacks-api.interface';
import { FeedbackUpdateData, IFeedbackFilter } from '../../model/feedback';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class FeedbacksApiService implements IFeedbacksApiService {
  private http = inject(HttpClient);

  getFeedback(profileId: UserProfile['id']): Observable<any> {
    return this.http.get(API_URL + `feedbacks/${profileId}`);
  }

  updateFeedback(feedback: FeedbackUpdateData): Observable<any> {
    return this.http.put(
      API_URL + 'subscription-plan-update',
      JSON.stringify(feedback)
    );
  }

  getFeedbacks(): Observable<any> {
    return this.http.get(API_URL + 'feedbacks');
  }

  getFeedbacksOverTime(_option: IFeedbackFilter): Observable<any> {
    return this.http.get(API_URL + 'feedbacks');
  }

  getFeedbackAverage(_option: IFeedbackFilter): Observable<any> {
    return this.http.get(API_URL + 'feedback-average');
  }
}
