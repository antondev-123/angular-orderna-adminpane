import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTopRecentProductsComponent } from './customer-top-recent-products.component';

describe('CustomerTop5RecentProductsComponent', () => {
  let component: CustomerTopRecentProductsComponent;
  let fixture: ComponentFixture<CustomerTopRecentProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTopRecentProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerTopRecentProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
