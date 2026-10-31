import type { PatternEdge, Piece, Point, Polyline } from './types';

export const range = (count: number) =>
  Array.from({ length: count }, (_, index) => index);

/** Evenly spaced values from start to end inclusive. */
export const steps = (start: number, end: number, count: number) =>
  range(count + 1).map(index => start + ((end - start) * index) / count);

/**
 * Points on a circle around (0, 0), with angle 0 straight up and angles
 * growing clockwise, so an arc centred on 0 bows upwards on the page.
 */
export const arc = (
  radius: number,
  from: number,
  to: number,
  count: number,
): Polyline =>
  steps(from, to, count).map(
    angle => [radius * Math.sin(angle), -radius * Math.cos(angle)] as const,
  );

/** Enough samples that a curve's chords stay within a fraction of a mm. */
export const arcSamples = (radius: number, sweep: number) =>
  Math.max(8, Math.ceil((Math.abs(sweep) * radius) / 2));

export const signedArea = (polygon: Polyline) =>
  polygon.reduce((sum, [x1, y1], index) => {
    const [x2, y2] = polygon[(index + 1) % polygon.length];
    return sum + x1 * y2 - x2 * y1;
  }, 0) / 2;

const sub = ([ax, ay]: Point, [bx, by]: Point): Point => [ax - bx, ay - by];
const add = ([ax, ay]: Point, [bx, by]: Point): Point => [ax + bx, ay + by];
const scale = ([x, y]: Point, factor: number): Point => [
  x * factor,
  y * factor,
];
const lengthOf = ([x, y]: Point) => Math.hypot(x, y);
const normalise = (vector: Point) => scale(vector, 1 / (lengthOf(vector) || 1));

const dedupe = (polygon: Polyline) =>
  polygon.filter(
    (point, index) =>
      lengthOf(sub(point, polygon[(index + 1) % polygon.length])) > 1e-6,
  );

/** The normal of segment a→b that points out of a polygon of this winding. */
const outwardNormal = (a: Point, b: Point, winding: number): Point => {
  const [dx, dy] = normalise(sub(b, a));
  return winding > 0 ? [dy, -dx] : [-dy, dx];
};

/**
 * Grows a closed polygon by distance, mitring gentle corners and bevelling
 * sharp ones (a gore's tip) so the allowance never spikes out.
 */
export const offsetPolygon = (polygon: Polyline, distance: number) => {
  if (distance === 0) return polygon;
  const points = dedupe(polygon);
  const winding = Math.sign(signedArea(points));
  return points.flatMap((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const before = outwardNormal(previous, point, winding);
    const after = outwardNormal(point, next, winding);
    const bisector = normalise(add(before, after));
    const cosHalf = bisector[0] * before[0] + bisector[1] * before[1];
    if (cosHalf < 0.5)
      return [
        add(point, scale(before, distance)),
        add(point, scale(after, distance)),
      ];
    return [add(point, scale(bisector, distance / cosHalf))];
  });
};

/**
 * Inserts a glue tab on each listed edge (vertex index to the next vertex).
 * The tab tapers at 45° and never takes more than a third of a short edge.
 */
export const withTabs = (
  polygon: Polyline,
  edgeIndices: Array<number>,
  depth: number,
) => {
  const winding = Math.sign(signedArea(polygon));
  return polygon.flatMap((point, index) => {
    if (!edgeIndices.includes(index)) return [point];
    const next = polygon[(index + 1) % polygon.length];
    const along = sub(next, point);
    const span = lengthOf(along);
    const tabDepth = Math.min(depth, span / 3);
    const direction = normalise(along);
    const out = scale(outwardNormal(point, next, winding), tabDepth);
    return [
      point,
      add(add(point, scale(direction, tabDepth)), out),
      add(add(next, scale(direction, -tabDepth)), out),
    ];
  });
};

/** The edges of a polygon that get tabs, as their two end points. */
export const edgeSegments = (polygon: Polyline, edgeIndices: Array<number>) =>
  edgeIndices.map(index => [
    polygon[index],
    polygon[(index + 1) % polygon.length],
  ]);

const NOTCH_MM = 4;

/** A short tick crossing into the piece at a fraction along a segment. */
export const notch = (
  a: Point,
  b: Point,
  at: number,
  polygon: Polyline,
): Polyline => {
  const winding = Math.sign(signedArea(polygon));
  const base = add(a, scale(sub(b, a), at));
  const inward = scale(outwardNormal(a, b, winding), -NOTCH_MM);
  return [base, add(base, inward)];
};

/** A notch at a fraction along a sampled curve, measured by arc length. */
export const notchAlong = (
  curve: Polyline,
  at: number,
  polygon: Polyline,
): Polyline => {
  const lengths = curve
    .slice(1)
    .map((point, index) => lengthOf(sub(point, curve[index])));
  const target = lengths.reduce((sum, value) => sum + value, 0) * at;
  const { index, before } = lengths.reduce(
    (found, value, segment) =>
      found.index === -1 && found.before + value >= target
        ? { index: segment, before: found.before }
        : found.index === -1
          ? { index: -1, before: found.before + value }
          : found,
    { index: -1, before: 0 },
  );
  const found = Math.max(0, index === -1 ? lengths.length - 1 : index);
  const raw = (target - before) / (lengths[found] || 1);
  // A target on a sample point always takes the segment after it: which
  // side the sum lands on differs by an ulp between JS engines, and the
  // notch's angle follows the segment, so SSR and hydration would disagree.
  const onVertex = 1 - raw < 1e-9 && found < lengths.length - 1;
  const segment = onVertex ? found + 1 : found;
  const local = onVertex ? 0 : raw;
  return notch(
    curve[segment],
    curve[segment + 1],
    Math.min(1, Math.max(0, local)),
    polygon,
  );
};

export const bounds = (points: Polyline) => {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    minX,
    minY,
    width: Math.max(...xs) - minX,
    height: Math.max(...ys) - minY,
  };
};

export const shift = (points: Polyline, dx: number, dy: number): Polyline =>
  points.map(([x, y]) => [x + dx, y + dy] as const);

export const rotate = (points: Polyline, angle: number): Polyline =>
  points.map(
    ([x, y]) =>
      [
        x * Math.cos(angle) - y * Math.sin(angle),
        x * Math.sin(angle) + y * Math.cos(angle),
      ] as const,
  );

/** A rectangle from (0, 0), clockwise on the page from the top-left corner. */
export const rect = (width: number, height: number): Polyline => [
  [0, 0],
  [width, 0],
  [width, height],
  [0, height],
];

/** The vertices of a regular polygon with this side length, flat side down. */
export const regularPolygon = (sides: number, side: number): Polyline => {
  const radius = side / (2 * Math.sin(Math.PI / sides));
  return range(sides).map(index => {
    const angle = Math.PI + (Math.PI / sides) * (2 * index + 1);
    return [radius * Math.sin(angle), -radius * Math.cos(angle)] as const;
  });
};

interface PieceInput {
  id: string;
  name: string;
  cut: number;
  outline: Polyline;
  edges: Array<PatternEdge>;
  folds?: Array<Polyline>;
  notches?: Array<Polyline>;
  tabs?: Array<number>;
  tabDepth?: number;
  seamMm: number;
}

/**
 * Finishes a piece: adds tabs and seam allowance to get the cut line, then
 * moves everything so the cut line's top-left corner sits at (0, 0).
 */
export const makePiece = ({
  id,
  name,
  cut,
  outline,
  edges,
  folds = [],
  notches = [],
  tabs = [],
  tabDepth = 8,
  seamMm,
}: PieceInput): Piece => {
  const tabbed = tabs.length > 0 ? withTabs(outline, tabs, tabDepth) : outline;
  const cutLine = offsetPolygon(tabbed, seamMm);
  const tabFolds = edgeSegments(outline, tabs);
  const { minX, minY } = bounds(cutLine);
  const move = (points: Polyline) => shift(points, -minX, -minY);
  const inner = bounds(outline);
  return {
    id,
    name,
    cut,
    outline: move(outline),
    cutLine: move(cutLine),
    // Card tabs fold on their own lines; the rest of the outline is a cut.
    stitch: seamMm > 0,
    edges: edges.map(edge => ({ ...edge, points: move(edge.points) })),
    folds: [...folds, ...tabFolds].map(move),
    notches: notches.map(move),
    label: [
      inner.minX - minX + inner.width / 2,
      inner.minY - minY + inner.height / 2,
    ],
  };
};

export const pieceSize = (piece: Piece) => bounds(piece.cutLine);

export const ID_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Hands out piece letters in the order the pieces are listed. */
export const letter = (index: number) => ID_LETTERS[index] ?? `P${index + 1}`;

export const TAU = Math.PI * 2;

export const radiusOf = (circumference: number) => circumference / TAU;

export const degrees = (radians: number) => (radians * 180) / Math.PI;

/** A horizontal ring of the 3D model, closed back on its first point. */
export const ring = (
  radius: number,
  y: number,
  count = 96,
): Array<readonly [number, number, number]> =>
  steps(0, TAU, count).map(
    angle => [radius * Math.sin(angle), y, radius * Math.cos(angle)] as const,
  );
