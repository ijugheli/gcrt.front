/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AttributesService } from './Attributes.service';

describe('Service: Attributes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttributesService]
    });
  });

  it('should ...', inject([AttributesService], (service: AttributesService) => {
    expect(service).toBeTruthy();
  }));
});
