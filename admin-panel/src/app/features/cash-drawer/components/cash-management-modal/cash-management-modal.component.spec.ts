import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashManagementModalComponent } from './cash-management-modal.component';

describe('CashManagementModalComponent', () => {
  let component: CashManagementModalComponent;
  let fixture: ComponentFixture<CashManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashManagementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
