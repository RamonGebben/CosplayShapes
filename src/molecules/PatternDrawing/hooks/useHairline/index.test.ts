import { describe, expect, it } from 'vitest';
import { hairline } from './hairline';

describe('hairline', () => {
  it('is one device pixel in CSS pixels', () => {
    expect(hairline(2)).toBe(0.5);
    expect(hairline(1)).toBe(1);
    expect(hairline(0)).toBe(1);
  });
});
