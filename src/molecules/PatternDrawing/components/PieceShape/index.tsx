'use client';

import { useTheme } from 'styled-components';
import { bounds, type Piece } from '~/utils/pattern';
import { labelPlacement } from '~/utils/patternText';
import { pieceLabel, toPath } from '~/utils/svgExport';

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
}

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
}: PieceShapeProps) => {
  const theme = useTheme();
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
        transform={`translate(${x} ${y})`}
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
  const [lx, ly] =
    placement === 'beside'
      ? [box.minX + box.width + (labelSize ?? 0), piece.label[1]]
      : piece.label;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={toPath(piece.cutLine, true)}
        style={{ ...stroke, stroke: ink }}
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
          style={{ ...stroke, stroke: ink }}
        />
      ))}
      {lit.map((edge, index) => (
        <path
          key={`lit-${index}`}
          d={toPath(edge.points)}
          strokeLinecap="round"
          style={{
            ...stroke,
            strokeWidth: line * 3,
            stroke: theme.color('secondary'),
          }}
        />
      ))}
      {labelSize && placement && (
        <text
          x={lx}
          y={ly}
          textAnchor={placement === 'beside' ? 'start' : 'middle'}
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
