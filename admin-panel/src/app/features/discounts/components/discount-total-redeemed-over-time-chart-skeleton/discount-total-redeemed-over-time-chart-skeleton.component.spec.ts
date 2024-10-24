import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTotalRedeemedOverTimeChartSkeletonComponent } from './discount-total-redeemed-over-time-chart-skeleton.component';

describe('DiscountTotalRedeemedOverTimeChartSkeletonComponent', () => {
  let component: DiscountTotalRedeemedOverTimeChartSkeletonComponent;
  let fixture: ComponentFixture<DiscountTotalRedeemedOverTimeChartSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountTotalRedeemedOverTimeChartSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscountTotalRedeemedOverTimeChartSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
