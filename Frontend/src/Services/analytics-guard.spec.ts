import { TestBed } from '@angular/core/testing';

import { AnalyticsGuard } from './analytics-guard';

describe('AnalyticsGuard', () => {
  let service: AnalyticsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
