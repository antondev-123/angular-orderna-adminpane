import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBestSellersComponent } from './dashboard-best-sellers.component';

describe('DashboardBestSellersComponent', () => {
  let component: DashboardBestSellersComponent;
  let fixture: ComponentFixture<DashboardBestSellersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBestSellersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardBestSellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
