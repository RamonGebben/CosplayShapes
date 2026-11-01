'use client';

import styled from 'styled-components';

const CX = 100;
const CY = 104;
const R = 62;
/** The tape line runs just outside the edge it measures. */
const TAPE = R + 13;
const RADIUS_ANGLE = (125 * Math.PI) / 180;
const TAPE_ARROW_ANGLE = (-58 * Math.PI) / 180;

// Trig lands an ulp apart in different JS engines, which would fail hydration.
const round = (value: number) => Math.round(value * 100) / 100;

const at = (radius: number, angle: number) =>
  [
    round(CX + radius * Math.cos(angle)),
    round(CY + radius * Math.sin(angle)),
  ] as const;

/** A filled arrowhead with its tip at (x, y), pointing along angle. */
const arrowhead = (x: number, y: number, angle: number, size = 7) => {
  const corner = (side: number) =>
    `${round(x - size * Math.cos(angle) + side * (size / 2) * Math.sin(angle))},${round(
      y - size * Math.sin(angle) - side * (size / 2) * Math.cos(angle),
    )}`;
  return `${x},${y} ${corner(1)} ${corner(-1)}`;
};

const [radiusX, radiusY] = at(R - 1, RADIUS_ANGLE);
/** The radius label runs along its line, set off to the side below it. */
const [radiusLabelX, radiusLabelY] = at(R * 0.55, RADIUS_ANGLE);
const LABEL_OFFSET = 14;
const [tapeX, tapeY] = at(TAPE, TAPE_ARROW_ANGLE);

const Svg = styled.svg`
  display: block;
  width: 100%;
  max-width: 272px;
  height: auto;
  margin-inline: auto;
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeight('bold')};

  .disc {
    fill: ${({ theme }) => theme.color('primary', 'emphasis')};
    stroke: ${({ theme }) => theme.color('quaternary')};
    stroke-width: 1.5;
  }

  .around {
    fill: none;
    stroke: ${({ theme }) => theme.color('secondary')};
    stroke-width: 2.5;
    stroke-dasharray: 5 4;
  }

  .across {
    stroke: ${({ theme }) => theme.color('primary')};
    stroke-width: 2;
  }

  .half {
    stroke: ${({ theme }) => theme.color('quaternary')};
    stroke-width: 1.5;
  }

  .around-ink {
    fill: ${({ theme }) => theme.color('secondary', 'emphasis')};
  }

  .across-ink {
    fill: ${({ theme }) => theme.color('primary')};
  }

  .half-ink {
    fill: ${({ theme }) => theme.color('quaternary')};
  }
`;

/** Circumference, diameter and radius drawn on one circle, in the stage's line colours. */
export const MeasureDiagram = ({ titleId }: { titleId: string }) => (
  <Svg viewBox="0 0 272 190" role="img" aria-labelledby={titleId}>
    <title id={titleId}>
      A circle with its circumference traced all the way around the outside, its
      diameter drawn straight across through the middle, and its radius drawn
      from the middle to the edge.
    </title>
    <circle className="disc" cx={CX} cy={CY} r={R} />
    <circle className="around" cx={CX} cy={CY} r={TAPE} />
    <polygon
      className="around-ink"
      points={arrowhead(tapeX, tapeY, TAPE_ARROW_ANGLE + Math.PI / 2, 10)}
    />
    <text className="around-ink" x={162} y={30}>
      Circumference
    </text>
    <line className="across" x1={CX - R + 7} y1={CY} x2={CX + R - 7} y2={CY} />
    <polygon
      className="across-ink"
      points={arrowhead(CX - R + 1, CY, Math.PI)}
    />
    <polygon className="across-ink" points={arrowhead(CX + R - 1, CY, 0)} />
    <text className="across-ink" x={CX} y={CY - 9} textAnchor="middle">
      Diameter
    </text>
    <line
      className="half"
      x1={CX}
      y1={CY}
      x2={round(radiusX - 6 * Math.cos(RADIUS_ANGLE))}
      y2={round(radiusY - 6 * Math.sin(RADIUS_ANGLE))}
    />
    <polygon
      className="half-ink"
      points={arrowhead(radiusX, radiusY, RADIUS_ANGLE, 6)}
    />
    <text
      className="half-ink"
      textAnchor="middle"
      transform={`translate(${round(
        radiusLabelX + LABEL_OFFSET * Math.sin(RADIUS_ANGLE),
      )} ${round(radiusLabelY - LABEL_OFFSET * Math.cos(RADIUS_ANGLE))}) rotate(${round(
        (RADIUS_ANGLE * 180) / Math.PI - 180,
      )})`}
    >
      Radius
    </text>
    <circle className="half-ink" cx={CX} cy={CY} r={3} />
  </Svg>
);
