import { TestBed, inject } from '@angular/core/testing';

import { StudentAtentionService } from './student-atention.service';

describe('StudentAtentionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentAtentionService]
    });
  });

  it('should be created', inject([StudentAtentionService], (service: StudentAtentionService) => {
    expect(service).toBeTruthy();
  }));
});
