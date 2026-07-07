import {describe, expect, it} from 'vitest';

import {calcDistance} from './_calc-distance';

describe('calcDistance', () => {
  it('computes the pythagorean distance between two offsets', () => {
    expect(calcDistance(3, 4)).toBe(5);
  });

  it('floors fractional distances', () => {
    expect(calcDistance(1, 1)).toBe(1);
  });

  it('returns 0 for a zero offset', () => {
    expect(calcDistance(0, 0)).toBe(0);
  });
});
