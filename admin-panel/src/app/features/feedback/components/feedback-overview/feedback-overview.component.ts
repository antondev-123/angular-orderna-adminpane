import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IFeedbackAverage } from '@orderna/admin-panel/src/app/model/feedback';
import { FeedbackFilterStateService } from '@orderna/admin-panel/src/app/services/feedback/feedback-filter-state.service';
import { FeedbacksApiService } from '@orderna/admin-panel/src/app/services/feedbacks/feedbacks-api.service';
import { StarRatingComponent } from '@orderna/admin-panel/src/app/shared/components/star-rating/star-rating.component';
import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs';

interface PageData {
  isLoading: boolean;
  feedbackOverview?: IFeedbackAverage;
}

@Component({
  selector: 'app-feedback-overview',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  providers: [],
  templateUrl: './feedback-overview.component.html',
  styleUrl: './feedback-overview.component.css',
})
export class FeedbackOverviewComponent implements OnInit {
  errorMessage?: string;
  infoMessage?: string;

  data$!: Observable<PageData>;

  constructor(
    private feedbacksService: FeedbacksApiService,
    private cdr: ChangeDetectorRef,
    private feedbackFilterService: FeedbackFilterStateService
  ) {}

  ngOnInit() {
    this.data$ = this.feedbackFilterService.filterState$.pipe(
      startWith(this.feedbackFilterService.filterState$.value),
      switchMap((filter) =>
        this.feedbacksService.getFeedbackAverage(filter).pipe(
          map(
            (feedbackOverview): PageData => ({
              isLoading: false,
              feedbackOverview: feedbackOverview ?? undefined,
            })
          ),
          catchError((error) => this.handleError(error))
        )
      ),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    this.errorMessage = error.message;
    this.cdr.detectChanges();
    return of();
  }
}
