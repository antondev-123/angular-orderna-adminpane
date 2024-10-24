import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSidebarSummaryComponent } from './shop-sidebar-summary.component';

describe('ShopSidebarSummaryComponent', () => {
  let component: ShopSidebarSummaryComponent;
  let fixture: ComponentFixture<ShopSidebarSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopSidebarSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopSidebarSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
