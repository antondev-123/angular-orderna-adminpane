import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierGroupTableComponent } from './modifier-group-table.component';

describe('ModifierGroupTableComponent', () => {
  let component: ModifierGroupTableComponent;
  let fixture: ComponentFixture<ModifierGroupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierGroupTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
