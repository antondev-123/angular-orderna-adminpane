import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTotalRedeemedOverTimeChartComponent } from './discount-total-redeemed-over-time-chart.component';

describe('DiscountTotalRedeemedOverTimeChartComponent', () => {
  let component: DiscountTotalRedeemedOverTimeChartComponent;
  let fixture: ComponentFixture<DiscountTotalRedeemedOverTimeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountTotalRedeemedOverTimeChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscountTotalRedeemedOverTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
