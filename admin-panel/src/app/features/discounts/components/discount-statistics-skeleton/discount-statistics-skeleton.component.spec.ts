import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatisticsSkeletonComponent } from './discount-statistics-skeleton.component';

describe('CustomerStatisticsSkeletonComponent', () => {
  let component: CustomerStatisticsSkeletonComponent;
  let fixture: ComponentFixture<CustomerStatisticsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerStatisticsSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerStatisticsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
