import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationStoreViewComponent } from './pagination-store-view.component';

describe('PaginationStoreViewComponent', () => {
  let component: PaginationStoreViewComponent;
  let fixture: ComponentFixture<PaginationStoreViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationStoreViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaginationStoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
