import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreOpeningHourCardComponent } from './store-opening-hour-card.component';

describe('StoreOpeningHourCardComponent', () => {
  let component: StoreOpeningHourCardComponent;
  let fixture: ComponentFixture<StoreOpeningHourCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreOpeningHourCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreOpeningHourCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
