import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackAverageComponent } from './feedback-average.component';

describe('FeedbackAverageComponent', () => {
  let component: FeedbackAverageComponent;
  let fixture: ComponentFixture<FeedbackAverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackAverageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedbackAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
