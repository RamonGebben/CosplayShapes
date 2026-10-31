import { describe, expect, it } from 'vitest';
import { fitView } from './fitView';

describe('fitView', () => {
  it('scales content to the tighter side and centres it', () => {
    const view = fitView(
      { width: 200, height: 100 },
      { width: 440, height: 440 },
      20,
    );
    expect(view.scale).toBe(2);
    expect(view.width).toBe(220);
    expect(view.height).toBe(220);
    expect(view.x).toBe(-10);
    expect(view.y).toBe(-60);
  });
});
