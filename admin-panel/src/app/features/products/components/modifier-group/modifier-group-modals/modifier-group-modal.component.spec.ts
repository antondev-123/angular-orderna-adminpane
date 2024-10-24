import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierGroupModalComponent } from './modifier-group-modal.component';

describe('ModifierGroupModalComponent', () => {
  let component: ModifierGroupModalComponent;
  let fixture: ComponentFixture<ModifierGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierGroupModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
