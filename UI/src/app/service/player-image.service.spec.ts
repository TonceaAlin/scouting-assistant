import { TestBed } from '@angular/core/testing';

import { PlayerImageService } from './player-image.service';

describe('PlayerImageService', () => {
  let service: PlayerImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
