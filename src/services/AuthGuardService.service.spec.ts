/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthGuardServiceService } from './AuthGuardService.service';

describe('Service: AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardServiceService]
    });
  });

  it('should ...', inject([AuthGuardServiceService], (service: AuthGuardServiceService) => {
    expect(service).toBeTruthy();
  }));
});
