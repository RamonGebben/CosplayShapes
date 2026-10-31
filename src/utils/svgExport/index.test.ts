import { describe, expect, it } from 'vitest';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { getMaterial } from '~/utils/materials';
import { buildPattern } from '~/utils/pattern';
import { patternSvg, toPath } from '.';

describe('toPath', () => {
  it('draws and closes a path through the points', () => {
    expect(
      toPath(
        [
          [0, 0],
          [10, 0],
          [10, 5],
        ],
        true,
      ),
    ).toBe('M0 0 L10 0 L10 5 Z');
  });
});

describe('patternSvg', () => {
  it('sizes the drawing in millimetres for cutting software', () => {
    const result = buildPattern('box', {
      dims: { width: 100, depth: 50, height: 80 },
      options: { lid: false },
      material: getMaterial('paper'),
      thicknessMm: 0,
      seamMm: 0,
    });
    if (!result.ok) throw new Error(result.message);
    const layout = layoutPattern(result.pattern.pieces, PAPERS.a4);
    const svg = patternSvg(layout, 'Card');
    expect(svg).toContain(
      `width="${Math.round(layout.width * 1000) / 1000}mm"`,
    );
    expect(svg).toContain('class="score"');
  });
});
