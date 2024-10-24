import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultLayout } from './default-layout.component';

describe('AdminTemplateComponent', () => {
  let component: DefaultLayout;
  let fixture: ComponentFixture<DefaultLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
