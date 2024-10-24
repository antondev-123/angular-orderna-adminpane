import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLayout } from './shop-layout.component';

describe('ShopLayout', () => {
  let component: ShopLayout;
  let fixture: ComponentFixture<ShopLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
