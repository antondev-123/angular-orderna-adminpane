import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransactionsTimelineSkeletonComponent } from './customer-transactions-timeline-skeleton.component';

describe('CustomerTransactionsTimelineSkeletonComponent', () => {
  let component: CustomerTransactionsTimelineSkeletonComponent;
  let fixture: ComponentFixture<CustomerTransactionsTimelineSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTransactionsTimelineSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerTransactionsTimelineSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
