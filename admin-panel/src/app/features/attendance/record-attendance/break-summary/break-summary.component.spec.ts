import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakSummaryComponent } from './break-summary.component';

describe('BreakSummaryComponent', () => {
  let component: BreakSummaryComponent;
  let fixture: ComponentFixture<BreakSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreakSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreakSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
