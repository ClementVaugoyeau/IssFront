import { TestBed } from '@angular/core/testing';

import { AstronautService } from './astronaut.service';

describe('AstronautService', () => {
  let service: AstronautService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AstronautService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
