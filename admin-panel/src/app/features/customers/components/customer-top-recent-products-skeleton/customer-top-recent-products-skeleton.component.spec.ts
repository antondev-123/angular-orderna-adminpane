import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTop5RecentProductsSkeletonComponent } from './customer-top-recent-products-skeleton.component';

describe('CustomerTop5RecentProductsSkeletonComponent', () => {
  let component: CustomerTop5RecentProductsSkeletonComponent;
  let fixture: ComponentFixture<CustomerTop5RecentProductsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTop5RecentProductsSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      CustomerTop5RecentProductsSkeletonComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
