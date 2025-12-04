import { TestBed } from '@angular/core/testing';
import { Toy } from './toy'; // ✅ ovo je ispravno

describe('Toy', () => {
  let service: Toy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Toy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
