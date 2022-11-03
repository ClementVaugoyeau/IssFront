import { TestBed } from '@angular/core/testing';

import { IssDataService } from './iss-data.service';

describe('IssDataService', () => {
  let service: IssDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
