import { TestBed } from '@angular/core/testing';

import { CashDrawersMockApiService } from './cash-drawers-mock-api.service';

describe('CashDrawerService', () => {
  let service: CashDrawersMockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashDrawersMockApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
