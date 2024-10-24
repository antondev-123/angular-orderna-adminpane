import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceTrackingComponent } from './attendance-tracking.component';

describe('AttendanceTrackingComponent', () => {
  let component: AttendanceTrackingComponent;
  let fixture: ComponentFixture<AttendanceTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceTrackingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendanceTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
