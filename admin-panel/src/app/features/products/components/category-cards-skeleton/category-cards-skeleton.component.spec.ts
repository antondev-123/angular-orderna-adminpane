import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCardsSkeletonComponent } from './category-cards-skeleton.component';

describe('CategoryCardsSkeletonComponent', () => {
  let component: CategoryCardsSkeletonComponent;
  let fixture: ComponentFixture<CategoryCardsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCardsSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryCardsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
