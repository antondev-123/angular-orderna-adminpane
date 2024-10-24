import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakFreezeComponent } from './break-freeze.component';

describe('BreakFreezeComponent', () => {
  let component: BreakFreezeComponent;
  let fixture: ComponentFixture<BreakFreezeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreakFreezeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreakFreezeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
