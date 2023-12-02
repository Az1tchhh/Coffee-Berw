import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommentaryService } from './commentary.service';

describe('CommentaryService', () => {
  let service: CommentaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CommentaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
