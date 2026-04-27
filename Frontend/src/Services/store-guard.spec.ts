import { TestBed } from '@angular/core/testing';

import { StoreGuard } from './store-guard';

describe('StoreGuard', () => {
  let service: StoreGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
