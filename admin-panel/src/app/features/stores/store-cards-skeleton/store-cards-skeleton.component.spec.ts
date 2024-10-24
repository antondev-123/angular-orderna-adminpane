import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCardsSkeletonComponent } from './store-cards-skeleton.component';

describe('StoresSkeletonComponent', () => {
  let component: StoreCardsSkeletonComponent;
  let fixture: ComponentFixture<StoreCardsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreCardsSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreCardsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
