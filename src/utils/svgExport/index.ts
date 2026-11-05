import type { Layout } from '~/utils/layout';
import type { Piece, Polyline } from '~/utils/pattern';

/** To the micron, so float noise between JS engines never reaches the markup. */
export const round = (value: number) => Math.round(value * 1000) / 1000;

/** An SVG path through the points, closed back to the start when asked. */
export const toPath = (points: Polyline, close = false, dx = 0, dy = 0) =>
  points
    .map(
      ([x, y], index) =>
        `${index === 0 ? 'M' : 'L'}${round(x + dx)} ${round(y + dy)}`,
    )
    .join(' ') + (close ? ' Z' : '');

export interface PieceLabel {
  title: string;
  detail: string;
}

/** What every printed or cut piece says about itself. */
export const pieceLabel = (
  piece: Piece,
  materialLabel: string,
): PieceLabel => ({
  title: `${piece.id} · ${piece.name}`,
  detail: `Cut ${piece.cut} · ${materialLabel}`,
});

const escapeXml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Score and stitch lines use blue so cutting software can split them off. */
const SCORE_COLOR = '#1d2bd6';

/**
 * The whole layout as one SVG sized in millimetres, so cutting software
 * imports it at true scale. Cut lines are black, score/stitch lines blue.
 */
export const patternSvg = (layout: Layout, materialLabel: string) => {
  const width = round(layout.width);
  const height = round(layout.height);
  const pieces = layout.placed.map(({ piece, x, y }) => {
    const label = pieceLabel(piece, materialLabel);
    const [lx, ly] = piece.label;
    const guides = [
      ...(piece.stitch ? [toPath(piece.outline, true, x, y)] : []),
      ...piece.folds.map(fold => toPath(fold, false, x, y)),
    ];
    return [
      `<g id="piece-${piece.id}">`,
      `<path class="cut" d="${toPath(piece.cutLine, true, x, y)}"/>`,
      ...piece.notches.map(
        mark => `<path class="notch" d="${toPath(mark, false, x, y)}"/>`,
      ),
      ...guides.map(d => `<path class="score" d="${d}"/>`),
      `<text x="${round(x + lx)}" y="${round(y + ly)}" text-anchor="middle">${escapeXml(label.title)}</text>`,
      `<text x="${round(x + lx)}" y="${round(y + ly + 5)}" text-anchor="middle">${escapeXml(label.detail)}</text>`,
      '</g>',
    ].join('');
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}">`,
    '<style>',
    '.cut{fill:none;stroke:#000;stroke-width:0.5}',
    '.notch{fill:none;stroke:#000;stroke-width:1}',
    `.score{fill:none;stroke:${SCORE_COLOR};stroke-width:0.25;stroke-dasharray:2 1.5}`,
    'text{font:3.5px sans-serif;fill:#000}',
    '</style>',
    ...pieces,
    '</svg>',
  ].join('\n');
};
