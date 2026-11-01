import { describe, expect, it } from 'vitest';
import { centredScrollLeft } from '.';

describe('centredScrollLeft', () => {
  it('centres an item in the middle of the strip', () => {
    expect(
      centredScrollLeft({
        itemLeft: 1248,
        itemWidth: 146,
        viewWidth: 390,
        scrollWidth: 1969,
      }),
    ).toBe(1126);
  });

  it('stays at the start for an item near the start', () => {
    expect(
      centredScrollLeft({
        itemLeft: 102,
        itemWidth: 111,
        viewWidth: 390,
        scrollWidth: 1969,
      }),
    ).toBe(0);
  });

  it('stops at the end for an item near the end', () => {
    expect(
      centredScrollLeft({
        itemLeft: 1797,
        itemWidth: 156,
        viewWidth: 390,
        scrollWidth: 1969,
      }),
    ).toBe(1579);
  });

  it('does not scroll a strip that fits', () => {
    expect(
      centredScrollLeft({
        itemLeft: 40,
        itemWidth: 100,
        viewWidth: 390,
        scrollWidth: 390,
      }),
    ).toBe(0);
  });
});
