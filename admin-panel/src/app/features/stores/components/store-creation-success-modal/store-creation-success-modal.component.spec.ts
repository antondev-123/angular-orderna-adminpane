import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCreationSuccessModalComponent } from './store-creation-success-modal.component';

describe('StoreCreationSuccessModalComponent', () => {
  let component: StoreCreationSuccessModalComponent;
  let fixture: ComponentFixture<StoreCreationSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreCreationSuccessModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreCreationSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
