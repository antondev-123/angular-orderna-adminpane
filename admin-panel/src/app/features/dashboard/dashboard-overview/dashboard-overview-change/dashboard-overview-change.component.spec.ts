import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOverviewChangeComponent } from './dashboard-overview-change.component';

describe('DashboardOverviewChangeComponent', () => {
  let component: DashboardOverviewChangeComponent;
  let fixture: ComponentFixture<DashboardOverviewChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOverviewChangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardOverviewChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
