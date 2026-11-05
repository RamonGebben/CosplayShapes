import type { Point, Polyline } from '~/utils/pattern';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type Edge = readonly [Point, Point];

const edgesOf = (polygon: Polyline): Array<Edge> =>
  polygon.map((point, index) => [point, polygon[(index + 1) % polygon.length]]);

/** Clips a polygon to one side of an axis-aligned line. */
const clipSide = (
  polygon: Polyline,
  inside: (point: Point) => boolean,
  cross: (a: Point, b: Point) => Point,
): Polyline =>
  edgesOf(polygon).flatMap(([a, b]) => {
    if (inside(b)) return inside(a) ? [b] : [cross(a, b), b];
    return inside(a) ? [cross(a, b)] : [];
  });

const atX = (x: number) => (a: Point, b: Point) =>
  [x, a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0])] as const;

const atY = (y: number) => (a: Point, b: Point) =>
  [a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]), y] as const;

/** The part of a polygon inside a rectangle (Sutherland–Hodgman). */
export const clipToRect = (polygon: Polyline, rect: Rect): Polyline => {
  const right = rect.x + rect.width;
  const bottom = rect.y + rect.height;
  return [
    (p: Polyline) => clipSide(p, ([x]) => x >= rect.x, atX(rect.x)),
    (p: Polyline) => clipSide(p, ([x]) => x <= right, atX(right)),
    (p: Polyline) => clipSide(p, ([, y]) => y >= rect.y, atY(rect.y)),
    (p: Polyline) => clipSide(p, ([, y]) => y <= bottom, atY(bottom)),
  ].reduce(
    (clipped, side) => (clipped.length > 0 ? side(clipped) : []),
    polygon,
  );
};

export const polygonArea = (polygon: Polyline) =>
  Math.abs(
    edgesOf(polygon).reduce(
      (sum, [[x1, y1], [x2, y2]]) => sum + x1 * y2 - x2 * y1,
      0,
    ),
  ) / 2;

const segmentDistance = ([px, py]: Point, [[x1, y1], [x2, y2]]: Edge) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = dx * dx + dy * dy;
  const t =
    length === 0
      ? 0
      : Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / length));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
};

/** Whether a segment touches a box (Liang–Barsky). */
const hitsBox = ([[x1, y1], [x2, y2]]: Edge, box: Rect) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const range = [
    [-dx, x1 - box.x],
    [dx, box.x + box.width - x1],
    [-dy, y1 - box.y],
    [dy, box.y + box.height - y1],
  ].reduce<readonly [number, number] | undefined>(
    (span, [p, q]) => {
      if (!span) return undefined;
      if (p === 0) return q < 0 ? undefined : span;
      const t = q / p;
      const next =
        p < 0
          ? ([Math.max(span[0], t), span[1]] as const)
          : ([span[0], Math.min(span[1], t)] as const);
      return next[0] > next[1] ? undefined : next;
    },
    [0, 1],
  );
  return range !== undefined;
};

/** Steps across each axis of the search grid. */
const STEPS = 40;

/**
 * Clearance past this no longer counts: a label well inside a big piece
 * moves toward the middle of what is visible instead.
 */
const ENOUGH_MM = 20;

/** Side of the cells edges are filed under for nearby lookups, in mm. */
const CELL_MM = 20;

const span = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

/**
 * Edges filed by the grid cells their bounds touch, so a check near one
 * point only looks at the few edges around it, not the whole outline.
 */
const edgeIndex = (edges: Array<Edge>) => {
  const cell = (value: number) => Math.floor(value / CELL_MM);
  // Rows of cells never run anywhere near this far across.
  const key = (column: number, row: number) => column * 100_000 + row;
  const cells = edges.reduce((filed, edge) => {
    const [[x1, y1], [x2, y2]] = edge;
    span(cell(Math.min(x1, x2)), cell(Math.max(x1, x2))).forEach(column =>
      span(cell(Math.min(y1, y2)), cell(Math.max(y1, y2))).forEach(row => {
        const at = key(column, row);
        filed.set(at, [...(filed.get(at) ?? []), edge]);
      }),
    );
    return filed;
  }, new Map<number, Array<Edge>>());
  return (area: Rect) =>
    span(cell(area.x), cell(area.x + area.width)).flatMap(column =>
      span(cell(area.y), cell(area.y + area.height)).flatMap(
        row => cells.get(key(column, row)) ?? [],
      ),
    );
};

/**
 * Prepares a polygon for label searches, so trying a label both across and
 * along a piece files its edges once. The finder gives where a box of the
 * given size sits wholly inside the polygon, as its centre: as far from the
 * outline as it can get, leaning toward the middle of the polygon's bounds;
 * undefined when the box fits nowhere.
 */
export const spotFinder = (polygon: Polyline) => {
  const edges = edgesOf(polygon);
  const near = edgeIndex(edges);
  const xs = polygon.map(([x]) => x);
  const ys = polygon.map(([, y]) => y);
  const bounds = {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
  // Where the outline crosses each grid row, so inside is a count, not a
  // walk round every edge for every point.
  const rows = new Map<number, Array<number>>();
  const crossings = (y: number) => {
    const known = rows.get(y);
    if (known) return known;
    const found = edges
      .filter(([[, y1], [, y2]]) => y1 > y !== y2 > y)
      .map(([[x1, y1], [x2, y2]]) => x1 + ((y - y1) * (x2 - x1)) / (y2 - y1));
    rows.set(y, found);
    return found;
  };
  const inside = ([x, y]: Point) =>
    crossings(y).filter(at => at > x).length % 2 === 1;
  const clearance = ([x, y]: Point) =>
    Math.min(
      ENOUGH_MM,
      ...near({
        x: x - ENOUGH_MM,
        y: y - ENOUGH_MM,
        width: ENOUGH_MM * 2,
        height: ENOUGH_MM * 2,
      }).map(edge => segmentDistance([x, y], edge)),
    );

  return (size: { width: number; height: number }): Point | undefined => {
    if (polygon.length < 3) return undefined;
    const half = { x: size.width / 2, y: size.height / 2 };
    const minX = bounds.minX + half.x;
    const maxX = bounds.maxX - half.x;
    const minY = bounds.minY + half.y;
    const maxY = bounds.maxY - half.y;
    if (minX > maxX || minY > maxY) return undefined;
    const middle = [(minX + maxX) / 2, (minY + maxY) / 2] as const;
    const steps = (from: number, to: number) =>
      Array.from(
        { length: STEPS + 1 },
        (_, index) => from + ((to - from) * index) / STEPS,
      );
    // Nearer than the box's short half, an edge is surely in the box; past
    // its half diagonal, surely not. Only between does it need checking.
    const surelyIn = Math.min(half.x, half.y);
    const surelyOut = Math.hypot(half.x, half.y);
    const fits = (point: Point, room: number) => {
      if (room < surelyIn) return false;
      if (room >= surelyOut) return true;
      const box = { x: point[0] - half.x, y: point[1] - half.y, ...size };
      return !near(box).some(edge => hitsBox(edge, box));
    };
    return steps(minY, maxY)
      .flatMap(y => steps(minX, maxX).map(x => [x, y] as const))
      .filter(inside)
      .map(point => ({ point, room: clearance(point) }))
      .filter(({ point, room }) => fits(point, room))
      .map(({ point, room }) => ({
        point,
        score:
          room - Math.hypot(point[0] - middle[0], point[1] - middle[1]) * 0.2,
      }))
      .reduce<{ point: Point; score: number } | undefined>(
        (best, next) => (!best || next.score > best.score ? next : best),
        undefined,
      )?.point;
  };
};

/** One label search; see `spotFinder`. */
export const labelSpot = (
  polygon: Polyline,
  size: { width: number; height: number },
) => spotFinder(polygon)(size);
