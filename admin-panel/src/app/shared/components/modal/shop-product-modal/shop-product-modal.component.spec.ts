import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopProductModalComponent } from './shop-product-modal.component';

describe('ShopProductModalComponent', () => {
  let component: ShopProductModalComponent;
  let fixture: ComponentFixture<ShopProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopProductModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
