import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransactionsTimelineComponent } from './customer-transactions-timeline.component';

describe('CustomerTransactionsTimelineComponent', () => {
  let component: CustomerTransactionsTimelineComponent;
  let fixture: ComponentFixture<CustomerTransactionsTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTransactionsTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerTransactionsTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
