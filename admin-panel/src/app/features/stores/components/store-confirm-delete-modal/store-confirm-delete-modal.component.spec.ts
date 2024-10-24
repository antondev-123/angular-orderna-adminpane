import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreConfirmDeleteModalComponent } from './store-confirm-delete-modal.component';

describe('StoreConfirmDeleteModalComponent', () => {
  let component: StoreConfirmDeleteModalComponent;
  let fixture: ComponentFixture<StoreConfirmDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreConfirmDeleteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreConfirmDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
