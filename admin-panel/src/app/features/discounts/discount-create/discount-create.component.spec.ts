import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountCreateComponent } from './discount-create.component';

describe('DiscountCreateComponent', () => {
  let component: DiscountCreateComponent;
  let fixture: ComponentFixture<DiscountCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
