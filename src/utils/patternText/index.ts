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
