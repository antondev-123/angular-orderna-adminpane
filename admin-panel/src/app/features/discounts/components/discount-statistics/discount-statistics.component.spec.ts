import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountStatisticsComponent } from './discount-statistics.component';

describe('DiscountStatisticsComponent', () => {
  let component: DiscountStatisticsComponent;
  let fixture: ComponentFixture<DiscountStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscountStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
