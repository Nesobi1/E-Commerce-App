import { TestBed } from '@angular/core/testing';

import { CorporateGuard } from './corporate-guard';

describe('CorporateGuard', () => {
  let service: CorporateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorporateGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
