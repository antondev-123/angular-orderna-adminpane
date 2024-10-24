import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSidebarCartItemComponent } from './shop-sidebar-cart-item.component';

describe('ShopSidebarCartItemComponent', () => {
  let component: ShopSidebarCartItemComponent;
  let fixture: ComponentFixture<ShopSidebarCartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopSidebarCartItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopSidebarCartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
