import { TestBed } from '@angular/core/testing';

import { FeedbackFilterStateService } from './feedback-filter-state.service';

describe('FeedbackFilterStateService', () => {
  let service: FeedbackFilterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackFilterStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
