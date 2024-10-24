import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownTimeComponent } from './dropdown-time.component';

describe('DropdownTimeComponent', () => {
  let component: DropdownTimeComponent;
  let fixture: ComponentFixture<DropdownTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
