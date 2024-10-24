import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountUpdateComponent } from './discount-update.component';

describe('DiscountUpdateComponent', () => {
  let component: DiscountUpdateComponent;
  let fixture: ComponentFixture<DiscountUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscountUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
