import { describe, expect, it } from 'vitest';
import { clipToRect, labelSpot, polygonArea } from '.';

const square = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
] as const;

describe('clipToRect', () => {
  it('keeps only the part of a polygon inside the rectangle', () => {
    const clipped = clipToRect([...square], {
      x: 50,
      y: -10,
      width: 100,
      height: 60,
    });
    expect(polygonArea(clipped)).toBeCloseTo(50 * 50);
  });

  it('leaves nothing when the polygon misses the rectangle', () => {
    expect(
      clipToRect([...square], { x: 200, y: 0, width: 50, height: 50 }),
    ).toEqual([]);
  });
});

describe('labelSpot', () => {
  it('centres a box in a plain square', () => {
    const [x, y] = labelSpot([...square], { width: 30, height: 10 }) ?? [];
    expect(x).toBeCloseTo(50, 0);
    expect(y).toBeCloseTo(50, 0);
  });

  it('finds room in the arm of an L, not in the notch', () => {
    const ell = [
      [0, 0],
      [20, 0],
      [20, 80],
      [100, 80],
      [100, 100],
      [0, 100],
    ] as const;
    const [x = 0, y = 0] = labelSpot([...ell], { width: 40, height: 12 }) ?? [];
    expect(y).toBeGreaterThan(80);
    expect(x - 20).toBeGreaterThanOrEqual(0);
  });

  it('says so when the box fits nowhere', () => {
    expect(labelSpot([...square], { width: 120, height: 10 })).toBeUndefined();
  });
});
