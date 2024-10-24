import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamTrackerComponent } from './webcam-tracker.component';

describe('WebcamTrackerComponent', () => {
  let component: WebcamTrackerComponent;
  let fixture: ComponentFixture<WebcamTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebcamTrackerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebcamTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
