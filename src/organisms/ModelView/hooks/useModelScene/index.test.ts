import { describe, expect, it } from 'vitest';
import { boxCorners, fitDistance } from './fit';
import { INITIAL_ROTATION, rotateByDrag, rotateByKey } from './rotation';

describe('rotateByKey', () => {
  it('turns the model with the arrow keys and resets on Home', () => {
    const turned = rotateByKey(INITIAL_ROTATION, 'ArrowRight');
    expect(turned?.yaw).toBeCloseTo(INITIAL_ROTATION.yaw + Math.PI / 12);
    expect(rotateByKey({ yaw: 3, pitch: 0 }, 'Home')).toEqual(INITIAL_ROTATION);
    expect(rotateByKey(INITIAL_ROTATION, 'a')).toBeUndefined();
  });

  it('never tips the model past its limits', () => {
    const tipped = Array.from({ length: 20 }).reduce<typeof INITIAL_ROTATION>(
      rotation => rotateByKey(rotation, 'ArrowDown') ?? rotation,
      INITIAL_ROTATION,
    );
    expect(tipped.pitch).toBe(1.1);
    expect(rotateByDrag(INITIAL_ROTATION, 0, -1000).pitch).toBe(-0.7);
  });
});

describe('fitDistance', () => {
  it('backs off further for a taller model', () => {
    const tan = Math.tan(Math.PI / 20);
    const squat = fitDistance(boxCorners(50, 20, 50), 0, tan, tan);
    const tall = fitDistance(boxCorners(50, 120, 50), 0, tan, tan);
    expect(tall).toBeGreaterThan(squat);
  });

  it('keeps every corner inside the frame at any yaw', () => {
    const tan = Math.tan(Math.PI / 20);
    const corners = boxCorners(40, 90, 25);
    const distance = fitDistance(corners, 0.4, tan, tan, 1);
    corners.forEach(([x, , z]) => {
      expect(Math.abs(x) / (distance - z)).toBeLessThanOrEqual(tan + 1e-9);
    });
  });
});
