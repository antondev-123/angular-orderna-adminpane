import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStoreCompareComponent } from './dashboard-store-compare.component';

describe('DashboardStoreCompareComponent', () => {
  let component: DashboardStoreCompareComponent;
  let fixture: ComponentFixture<DashboardStoreCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStoreCompareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardStoreCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
