import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreTimeslotComponent } from './store-timeslot.component';

describe('StoreTimeslotComponent', () => {
  let component: StoreTimeslotComponent;
  let fixture: ComponentFixture<StoreTimeslotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreTimeslotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreTimeslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
