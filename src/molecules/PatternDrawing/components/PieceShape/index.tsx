'use client';

import { useTheme } from 'styled-components';
import { bounds, type Piece } from '~/utils/pattern';
import { besideSpot, labelPlacement } from '~/utils/patternText';
import { pieceLabel, round, toPath } from '~/utils/svgExport';

export interface PieceShapeProps {
  piece: Piece;
  x: number;
  y: number;
  line: number;
  /**
   * The paper layer is the piece's white fill; the lines layer is everything
   * drawn on it. Split so page edges can sit between the two.
   */
  layer: 'paper' | 'lines';
  highlight?: string;
  labelSize?: number;
  materialLabel: string;
  /** The other pieces' boxes, relative to this piece, for a label set beside it. */
  others?: Array<{ minX: number; minY: number; width: number; height: number }>;
}

/**
 * Line weights in CSS pixels: the cut line holds its own against the grid,
 * notches outweigh it so they read at a glance, and a lit edge outweighs both.
 */
const CUT_LINE_PX = 1;
const NOTCH_LINE_PX = 2;
const LIT_LINE_PX = 3;

/** One piece: its paper, or its cut line, guides, notches, lit edges and label. */
export const PieceShape = ({
  piece,
  x,
  y,
  line,
  layer,
  highlight,
  labelSize,
  materialLabel,
  others = [],
}: PieceShapeProps) => {
  const theme = useTheme();
  const translate = `translate(${round(x)} ${round(y)})`;
  const ink = theme.color('quaternary');
  const guide = theme.color('primary');
  const stroke = {
    vectorEffect: 'non-scaling-stroke' as const,
    strokeWidth: line,
    fill: 'none',
  };
  if (layer === 'paper')
    return (
      <path
        transform={translate}
        d={toPath(piece.cutLine, true)}
        style={{ fill: theme.color('background', 'emphasis') }}
      />
    );
  const lit = highlight
    ? piece.edges.filter(edge => edge.keys.includes(highlight))
    : [];
  const label = pieceLabel(piece, materialLabel);
  const box = bounds(piece.outline);
  const placement =
    labelSize === undefined
      ? undefined
      : labelPlacement(
          box,
          Math.max(label.title.length, label.detail.length),
          labelSize,
        );
  const beside =
    placement === 'beside' && labelSize !== undefined
      ? besideSpot(
          box,
          Math.max(label.title.length, label.detail.length),
          labelSize,
          others,
        )
      : undefined;
  const [lx, ly] = beside ? [beside.x, beside.y] : piece.label;
  return (
    <g transform={translate}>
      <path
        d={toPath(piece.cutLine, true)}
        style={{ ...stroke, strokeWidth: CUT_LINE_PX, stroke: ink }}
      />
      {piece.stitch && (
        <path
          d={toPath(piece.outline, true)}
          strokeDasharray="5 4"
          style={{ ...stroke, stroke: guide }}
        />
      )}
      {piece.folds.map((fold, index) => (
        <path
          key={`fold-${index}`}
          d={toPath(fold)}
          strokeDasharray="5 4"
          style={{ ...stroke, stroke: guide }}
        />
      ))}
      {piece.notches.map((mark, index) => (
        <path
          key={`notch-${index}`}
          d={toPath(mark)}
          style={{ ...stroke, strokeWidth: NOTCH_LINE_PX, stroke: ink }}
        />
      ))}
      {lit.map((edge, index) => (
        <path
          key={`lit-${index}`}
          d={toPath(edge.points)}
          strokeLinecap="round"
          style={{
            ...stroke,
            strokeWidth: LIT_LINE_PX,
            stroke: theme.color('secondary'),
          }}
        />
      ))}
      {labelSize && placement && (
        <text
          x={lx}
          y={ly}
          textAnchor={beside?.anchor ?? 'middle'}
          transform={
            placement === 'along' ? `rotate(-90 ${lx} ${ly})` : undefined
          }
          style={{
            fontSize: labelSize,
            fontWeight: 700,
            fill: ink,
            // A paper-coloured halo knocks out fold lines and page edges.
            paintOrder: 'stroke',
            stroke: theme.color('background', 'emphasis'),
            strokeWidth: labelSize * 0.4,
            strokeLinejoin: 'round',
          }}
        >
          {label.title}
          <tspan
            x={lx}
            dy={labelSize * 1.35}
            style={{
              fontSize: labelSize * 0.9,
              fontWeight: 400,
              fill: theme.color('quaternary', 'emphasis'),
            }}
          >
            {label.detail}
          </tspan>
        </text>
      )}
    </g>
  );
};
