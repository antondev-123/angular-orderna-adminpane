import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreOpeningHoursComponent } from './store-opening-hours.component';

describe('StoreOpeningHoursComponent', () => {
  let component: StoreOpeningHoursComponent;
  let fixture: ComponentFixture<StoreOpeningHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreOpeningHoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreOpeningHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
