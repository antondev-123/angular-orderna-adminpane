import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashedBorderAddButtonComponent } from './dashed-border-add-button.component';

describe('DashedBorderAddButtonComponent', () => {
  let component: DashedBorderAddButtonComponent;
  let fixture: ComponentFixture<DashedBorderAddButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashedBorderAddButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashedBorderAddButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
