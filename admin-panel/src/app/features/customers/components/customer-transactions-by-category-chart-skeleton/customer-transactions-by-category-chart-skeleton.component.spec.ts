import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransactionsByCategoryChartSkeletonComponent } from './customer-transactions-by-category-chart-skeleton.component';

describe('CustomerTransactionsByCategoryChartSkeletonComponent', () => {
  let component: CustomerTransactionsByCategoryChartSkeletonComponent;
  let fixture: ComponentFixture<CustomerTransactionsByCategoryChartSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTransactionsByCategoryChartSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerTransactionsByCategoryChartSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
