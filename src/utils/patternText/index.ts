import type { Layout, Paper } from '~/utils/layout';
import type { Material } from '~/utils/materials';
import type { Fact } from '~/utils/pattern';
import { roundTo, formatLength, type Unit } from '~/utils/units';

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

/** How much printing the export takes, for the export bar. */
export const exportSummary = (layout: Layout, paper: Paper) => ({
  pieces: plural(layout.placed.length, 'piece', 'pieces'),
  pages: plural(
    layout.tiles.length,
    `${paper.name} page`,
    `${paper.name} pages`,
  ),
});

/** The material as pieces are labelled with it: "EVA 6 mm". */
export const materialLabel = (material: Material, thicknessMm: number) =>
  thicknessMm > 0
    ? `${material.short} ${roundTo(thicknessMm, 1)} mm`
    : material.short;

export const formatFact = (fact: Fact, unit: Unit) => {
  if (fact.degrees !== undefined) return `${fact.degrees.toFixed(1)}°`;
  return (fact.lengths ?? [])
    .map(length => formatLength(length, unit))
    .join('\u00a0×\u00a0');
};

export type LabelPlacement = 'across' | 'along' | 'beside';

/** Bold label glyphs average about 0.56 of the font size across. */
const GLYPH_EM = 0.56;

/**
 * Where a piece's two-line label goes: across the piece when it fits, turned
 * along a tall narrow piece's length when that fits, otherwise beside it.
 * The name and cut count are never dropped.
 */
export const labelPlacement = (
  piece: { width: number; height: number },
  longestLine: number,
  fontSize: number,
): LabelPlacement => {
  const length = longestLine * fontSize * GLYPH_EM;
  const depth = fontSize * 2.6;
  if (length < piece.width * 0.9 && depth < piece.height * 0.9) return 'across';
  if (length < piece.height * 0.9 && depth < piece.width * 0.9) return 'along';
  return 'beside';
};

interface Box {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export interface BesideSpot {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
}

const overlaps = (a: Box, b: Box) =>
  a.minX < b.minX + b.width &&
  b.minX < a.minX + a.width &&
  a.minY < b.minY + b.height &&
  b.minY < a.minY + a.height;

/**
 * Where a label set beside a piece goes: to its right, else its left, below
 * or above, whichever first keeps clear of the other pieces. The point is the
 * first line's baseline, in the same frame as the boxes.
 */
export const besideSpot = (
  piece: Box,
  longestLine: number,
  fontSize: number,
  others: Array<Box>,
): BesideSpot => {
  const width = longestLine * fontSize * GLYPH_EM;
  const depth = fontSize * 2.6;
  // The baseline sits a little under the top of the two lines.
  const ascent = fontSize * 0.9;
  const right = piece.minX + piece.width;
  const bottom = piece.minY + piece.height;
  const middleX = piece.minX + piece.width / 2;
  const middleY = piece.minY + piece.height / 2;
  const spots: Array<{ spot: BesideSpot; box: Box }> = [
    {
      spot: { x: right + fontSize, y: middleY, anchor: 'start' },
      box: {
        minX: right + fontSize,
        minY: middleY - ascent,
        width,
        height: depth,
      },
    },
    {
      spot: { x: piece.minX - fontSize, y: middleY, anchor: 'end' },
      box: {
        minX: piece.minX - fontSize - width,
        minY: middleY - ascent,
        width,
        height: depth,
      },
    },
    {
      spot: { x: middleX, y: bottom + fontSize + ascent, anchor: 'middle' },
      box: {
        minX: middleX - width / 2,
        minY: bottom + fontSize,
        width,
        height: depth,
      },
    },
    {
      spot: {
        x: middleX,
        y: piece.minY - fontSize - depth + ascent,
        anchor: 'middle',
      },
      box: {
        minX: middleX - width / 2,
        minY: piece.minY - fontSize - depth,
        width,
        height: depth,
      },
    },
  ];
  const clear = spots.find(
    ({ box }) => !others.some(other => overlaps(box, other)),
  );
  return (clear ?? spots[0]).spot;
};
