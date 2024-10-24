import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOverdueModalComponent } from './payment-overdue-modal.component';

describe('PaymentOverdueModalComponent', () => {
  let component: PaymentOverdueModalComponent;
  let fixture: ComponentFixture<PaymentOverdueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentOverdueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentOverdueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
