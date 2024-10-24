import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreContactInformationComponent } from './store-contact-information.component';

describe('StoreContactInformationComponent', () => {
  let component: StoreContactInformationComponent;
  let fixture: ComponentFixture<StoreContactInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreContactInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreContactInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
