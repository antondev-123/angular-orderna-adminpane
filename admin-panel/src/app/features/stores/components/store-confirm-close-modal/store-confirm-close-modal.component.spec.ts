import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreConfirmCloseModalComponent } from './store-confirm-close-modal.component';

describe('StoreConfirmCloseModalComponent', () => {
  let component: StoreConfirmCloseModalComponent;
  let fixture: ComponentFixture<StoreConfirmCloseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreConfirmCloseModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreConfirmCloseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
