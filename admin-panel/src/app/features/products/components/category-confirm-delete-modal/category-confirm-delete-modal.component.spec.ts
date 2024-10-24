import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryConfirmDeleteModalComponent } from './category-confirm-delete-modal.component';

describe('CategoryConfirmDeleteModalComponent', () => {
  let component: CategoryConfirmDeleteModalComponent;
  let fixture: ComponentFixture<CategoryConfirmDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryConfirmDeleteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryConfirmDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
