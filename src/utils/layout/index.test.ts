import { describe, expect, it } from 'vitest';
import { getMaterial } from '~/utils/materials';
import { buildPattern, pieceSize } from '~/utils/pattern';
import { PAPERS, layoutPattern, printableArea, turnPiece } from '.';

const piecesFor = (...args: Parameters<typeof buildPattern>) => {
  const result = buildPattern(...args);
  if (!result.ok) throw new Error(result.message);
  return result.pattern.pieces;
};

const base = {
  options: {},
  material: getMaterial('eva'),
  thicknessMm: 0,
  seamMm: 0,
};

describe('layoutPattern', () => {
  it('fits a small piece on one page', () => {
    const pieces = piecesFor('cylinder', {
      ...base,
      dims: { circumference: 150, height: 40 },
    });
    const layout = layoutPattern(pieces, PAPERS.a4);
    expect(layout.tiles).toHaveLength(1);
  });

  it('tiles a long wrap across several pages and names them', () => {
    const pieces = piecesFor('cylinder', {
      ...base,
      dims: { circumference: 900, height: 100 },
    });
    const layout = layoutPattern(pieces, PAPERS.a4);
    const area = printableArea(PAPERS.a4);
    expect(layout.tiles.length).toBe(Math.ceil(900 / area.height));
    expect(layout.tiles[0].name).toBe('A1');
  });

  it('leaves empty grid cells out of the page count', () => {
    const pieces = piecesFor('truncated-cone', {
      ...base,
      dims: { top: 260, bottom: 320, height: 180 },
    });
    const layout = layoutPattern(pieces, PAPERS.letter);
    expect(layout.tiles.length).toBeLessThanOrEqual(
      layout.columns * layout.rows,
    );
  });
});

describe('turnPiece', () => {
  it('swaps a piece’s width and height', () => {
    const [piece] = piecesFor('cylinder', {
      ...base,
      dims: { circumference: 300, height: 50 },
    });
    const turned = pieceSize(turnPiece(piece));
    expect(turned.width).toBeCloseTo(50, 6);
    expect(turned.height).toBeCloseTo(300, 6);
    expect(turned.minX).toBeCloseTo(0, 6);
  });
});
