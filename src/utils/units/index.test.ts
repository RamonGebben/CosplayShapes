import { describe, expect, it } from 'vitest';
import { formatLength, fromUnit, parseInput, toInputValue } from '.';

describe('units', () => {
  it('converts between millimetres and the display units', () => {
    expect(fromUnit(2, 'in')).toBeCloseTo(50.8, 6);
    expect(toInputValue(254, 'in')).toBe('10.00');
    expect(toInputValue(183, 'cm')).toBe('18.3');
  });

  it('formats a length with its unit', () => {
    expect(formatLength(180, 'cm')).toBe('18.0\u00a0cm');
  });

  it('reads a comma as a decimal point and rejects text', () => {
    expect(parseInput('18,5')).toBe(18.5);
    expect(parseInput(' 7 ')).toBe(7);
    expect(parseInput('abc')).toBeUndefined();
    expect(parseInput('')).toBeUndefined();
  });
});
