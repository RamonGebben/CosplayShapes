import { describe, expect, it } from 'vitest';
import { isOutside } from './isOutside';

const inside = {} as EventTarget;
const container = { contains: (node: Node | null) => node === inside };

describe('isOutside', () => {
  it('is false for a target inside the container', () => {
    expect(isOutside(container, inside)).toBe(false);
  });

  it('is true for a target elsewhere', () => {
    expect(isOutside(container, {} as EventTarget)).toBe(true);
  });

  it('is true before the container has mounted', () => {
    expect(isOutside(null, inside)).toBe(true);
  });
});
