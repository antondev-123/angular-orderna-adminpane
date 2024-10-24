import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransactionsByCategoryChartComponent } from './customer-transactions-by-category-chart.component';

describe('CustomerTransactionsByCategoryChartComponent', () => {
  let component: CustomerTransactionsByCategoryChartComponent;
  let fixture: ComponentFixture<CustomerTransactionsByCategoryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTransactionsByCategoryChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerTransactionsByCategoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
