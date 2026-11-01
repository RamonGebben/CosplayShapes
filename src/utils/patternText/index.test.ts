import { describe, expect, it } from 'vitest';
import { PAPERS, layoutPattern } from '~/utils/layout';
import { getMaterial } from '~/utils/materials';
import { buildPattern } from '~/utils/pattern';
import {
  besideSpot,
  exportSummary,
  formatFact,
  labelPlacement,
  materialLabel,
} from '.';

describe('exportSummary', () => {
  it('counts pieces and printed pages', () => {
    const result = buildPattern('cylinder', {
      dims: { circumference: 900, height: 100 },
      options: { ends: true },
      material: getMaterial('eva'),
      thicknessMm: 0,
      seamMm: 0,
    });
    if (!result.ok) throw new Error(result.message);
    const layout = layoutPattern(result.pattern.pieces, PAPERS.letter);
    const summary = exportSummary(layout, PAPERS.letter);
    expect(summary.pieces).toBe('2 pieces');
    expect(summary.pages).toMatch(/^\d+ Letter pages?$/);
  });
});

describe('materialLabel', () => {
  it('adds the thickness only when there is one', () => {
    expect(materialLabel(getMaterial('eva'), 6)).toBe('EVA 6 mm');
    expect(materialLabel(getMaterial('fabric'), 0)).toBe('Fabric');
  });
});

describe('formatFact', () => {
  it('formats lengths in the unit and angles in degrees', () => {
    expect(formatFact({ label: 'Face', lengths: [100, 254] }, 'in')).toBe(
      '3.94\u00a0in\u00a0×\u00a010.00\u00a0in',
    );
    expect(formatFact({ label: 'Arc', degrees: 19.08 }, 'cm')).toBe('19.1°');
  });
});

describe('labelPlacement', () => {
  it('sets the label across a piece wide enough for it', () => {
    expect(labelPlacement({ width: 200, height: 100 }, 16, 5)).toBe('across');
  });

  it('turns the label along a tall narrow piece', () => {
    expect(labelPlacement({ width: 30, height: 200 }, 16, 5)).toBe('along');
  });

  it('sets the label beside a piece too small either way', () => {
    expect(labelPlacement({ width: 10, height: 20 }, 16, 5)).toBe('beside');
  });
});

describe('besideSpot', () => {
  const piece = { minX: 0, minY: 0, width: 10, height: 20 };

  it('sets the label to the right of a piece with room there', () => {
    expect(besideSpot(piece, 16, 5, [])).toEqual({
      x: 15,
      y: 10,
      anchor: 'start',
    });
  });

  it('moves the label left when another piece sits to the right', () => {
    const neighbour = { minX: 20, minY: 0, width: 30, height: 30 };
    expect(besideSpot(piece, 16, 5, [neighbour]).anchor).toBe('end');
  });

  it('drops the label below a piece hemmed in on both sides', () => {
    const left = { minX: -40, minY: 0, width: 30, height: 30 };
    const right = { minX: 20, minY: 0, width: 30, height: 30 };
    expect(besideSpot(piece, 16, 5, [left, right])).toMatchObject({
      x: 5,
      anchor: 'middle',
    });
  });
});
