'use client';

import { useRef } from 'react';
import { useTheme } from 'styled-components';
import type { Layout } from '~/utils/layout';
import { bounds } from '~/utils/pattern';
import type { Unit } from '~/utils/units';
import { PieceShape } from './components/PieceShape';
import { Surface } from './components/Surface';
import { Svg } from './components/Svg';
import { useFittedView } from './hooks/useFittedView';
import { useHairline } from './hooks/useHairline';

export interface PatternDrawingProps {
  layout: Layout;
  /** What the drawing shows, for screen readers. */
  title: string;
  /** The measurement whose edges are lit. */
  highlight?: string;
  showPages?: boolean;
  unit?: Unit;
  materialLabel?: string;
  /**
   * The working view: fitted to its box, with a true-scale grid behind the
   * pieces, piece labels and page edges. Off for thumbnails.
   */
  detailed?: boolean;
  /** Space around the pieces, in px. */
  padding?: number;
}

const GRID_MM: Record<Unit, number> = { cm: 10, in: 25.4 };

const gridPath = (
  view: { x: number; y: number; width: number; height: number },
  spacing: number,
) => {
  const first = (start: number) => Math.ceil(start / spacing) * spacing;
  const xs = Array.from(
    { length: Math.ceil(view.width / spacing) + 1 },
    (_, index) => first(view.x) + index * spacing,
  );
  const ys = Array.from(
    { length: Math.ceil(view.height / spacing) + 1 },
    (_, index) => first(view.y) + index * spacing,
  );
  return [
    ...xs.map(x => `M${x} ${view.y}V${view.y + view.height}`),
    ...ys.map(y => `M${view.x} ${y}H${view.x + view.width}`),
  ].join('');
};

/** The laid-out pattern, drawn from its real geometry in millimetres. */
export const PatternDrawing = ({
  layout,
  title,
  highlight,
  showPages = false,
  unit = 'cm',
  materialLabel = '',
  detailed = false,
  padding = 24,
}: PatternDrawingProps) => {
  const theme = useTheme();
  const surface = useRef<HTMLDivElement>(null);
  const hairline = useHairline();
  const fitted = useFittedView(surface, layout, padding);
  const margin = Math.max(layout.width, layout.height) * 0.06;
  const view =
    detailed && fitted
      ? fitted
      : {
          scale: 0,
          x: -margin,
          y: -margin,
          width: layout.width + margin * 2,
          height: layout.height + margin * 2,
        };
  const showDetail = detailed && fitted !== undefined;
  const labelSize = showDetail ? 13 / view.scale : undefined;
  return (
    <Surface ref={surface}>
      <Svg
        role="img"
        aria-label={title}
        viewBox={[view.x, view.y, view.width, view.height]
          .map(value => Math.round(value * 1000) / 1000)
          .join(' ')}
        preserveAspectRatio="xMidYMid meet"
      >
        {showDetail && (
          <path
            d={gridPath(view, GRID_MM[unit])}
            style={{
              fill: 'none',
              stroke: theme.color('formBackground', 'emphasis'),
              strokeWidth: hairline,
              vectorEffect: 'non-scaling-stroke',
            }}
          />
        )}
        {layout.placed.map(({ piece, x, y }) => (
          <PieceShape
            key={`paper-${piece.id}`}
            layer="paper"
            piece={piece}
            x={x}
            y={y}
            line={hairline}
            materialLabel={materialLabel}
          />
        ))}
        {showDetail &&
          showPages &&
          layout.tiles.map(tile => (
            <g key={tile.name}>
              <rect
                x={tile.column * layout.tileWidth}
                y={tile.row * layout.tileHeight}
                width={layout.tileWidth}
                height={layout.tileHeight}
                strokeDasharray="1 5"
                strokeLinecap="round"
                style={{
                  fill: 'none',
                  stroke: theme.color('quaternary', 'emphasis'),
                  strokeWidth: hairline * 2,
                  vectorEffect: 'non-scaling-stroke',
                }}
              />
              <text
                // Bottom-right: packing fills pages from the top-left, so
                // this corner is the one least likely to sit on a piece.
                // Clamped so a tile running past the stage keeps its label.
                x={
                  Math.min(
                    (tile.column + 1) * layout.tileWidth,
                    view.x + view.width,
                  ) -
                  6 / view.scale
                }
                y={(tile.row + 1) * layout.tileHeight - 8 / view.scale}
                textAnchor="end"
                style={{
                  fontSize: 12 / view.scale,
                  fontWeight: 700,
                  fill: theme.color('quaternary', 'emphasis'),
                }}
              >
                Page {tile.name}
              </text>
            </g>
          ))}
        {layout.placed.map(({ piece, x, y }) => (
          <PieceShape
            key={`lines-${piece.id}`}
            layer="lines"
            piece={piece}
            x={x}
            y={y}
            line={hairline}
            highlight={highlight}
            labelSize={labelSize}
            materialLabel={materialLabel}
            others={layout.placed
              .filter(other => other.piece.id !== piece.id)
              .map(other => {
                const box = bounds(other.piece.cutLine);
                return {
                  ...box,
                  minX: box.minX + other.x - x,
                  minY: box.minY + other.y - y,
                };
              })}
          />
        ))}
      </Svg>
    </Surface>
  );
};
