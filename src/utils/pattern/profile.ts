import { range } from './geometry';
import type { Polyline } from './types';

/** A point on a lathe profile: [radius, height] in mm, y up. */
export type ProfilePoint = readonly [number, number];

/**
 * One smooth stretch of a profile, from t = 0 to t = 1. A profile runs from
 * the top down the outside, so the outward normal is the tangent turned left.
 */
export interface ProfileSegment {
  at: (t: number) => ProfilePoint;
  samples: number;
}

/** Roughly how far apart gore samples sit along the seam, in mm. */
const SPACING_MM = 3;

const MIN_SAMPLES = 12;

const curveSamples = (length: number) =>
  Math.max(MIN_SAMPLES, Math.ceil(length / SPACING_MM));

export const line = (from: ProfilePoint, to: ProfilePoint): ProfileSegment => ({
  at: t => [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t],
  // A straight stretch keeps a straight gore edge, so its ends are enough.
  samples: 1,
});

/**
 * An arc of a circle around centre, with angle 0 straight up and angles
 * growing outwards, so a dome's top is 0 and its equator π/2.
 */
export const circular = (
  centre: ProfilePoint,
  radius: number,
  from: number,
  to: number,
): ProfileSegment => ({
  at: t => {
    const angle = from + (to - from) * t;
    return [
      centre[0] + radius * Math.sin(angle),
      centre[1] + radius * Math.cos(angle),
    ];
  },
  samples: curveSamples(radius * Math.abs(to - from)),
});

/** An arc of an ellipse with these half-widths, angles as for circular. */
export const elliptical = (
  centre: ProfilePoint,
  across: number,
  up: number,
  from: number,
  to: number,
): ProfileSegment => ({
  at: t => {
    const angle = from + (to - from) * t;
    return [
      centre[0] + across * Math.sin(angle),
      centre[1] + up * Math.cos(angle),
    ];
  },
  samples: curveSamples(Math.max(across, up) * Math.abs(to - from)),
});

const STEP = 1e-6;

/** The unit tangent at t, from a short chord so any curve works. */
const tangentAt = (segment: ProfileSegment, t: number): ProfilePoint => {
  const [r1, y1] = segment.at(Math.max(0, t - STEP));
  const [r2, y2] = segment.at(Math.min(1, t + STEP));
  const length = Math.hypot(r2 - r1, y2 - y1) || 1;
  return [(r2 - r1) / length, (y2 - y1) / length];
};

/** The segment moved this far along its outward normal. */
const offsetSegment = (
  segment: ProfileSegment,
  distance: number,
): ProfileSegment => ({
  samples: segment.samples,
  at: t => {
    const [r, y] = segment.at(t);
    const [dr, dy] = tangentAt(segment, t);
    return [r - dy * distance, y + dr * distance];
  },
});

const chordSum = (
  segment: ProfileSegment,
  from: number,
  to: number,
  n: number,
) =>
  range(n).reduce((sum, index) => {
    const [r1, y1] = segment.at(from + ((to - from) * index) / n);
    const [r2, y2] = segment.at(from + ((to - from) * (index + 1)) / n);
    return sum + Math.hypot(r2 - r1, y2 - y1);
  }, 0);

/**
 * Arc length between two parameters. Chords fall short by a term in the
 * square of their angle; combining 8 and 16 chords cancels it, so circles come
 * out exact to well under a micron.
 */
const arcLength = (segment: ProfileSegment, from: number, to: number) =>
  (4 * chordSum(segment, from, to, 16) - chordSum(segment, from, to, 8)) / 3;

interface Sample {
  point: ProfilePoint;
  /** Distance along the profile from its first sample. */
  along: number;
}

const sampleSegments = (segments: Array<ProfileSegment>) =>
  segments.reduce<{ samples: Array<Sample>; joins: Array<number> }>(
    ({ samples, joins }, segment, index) => {
      const start = samples.length > 0 ? samples[samples.length - 1].along : 0;
      const ts = range(segment.samples + 1).map(i => i / segment.samples);
      const alongs = ts.reduce<Array<number>>(
        (sums, t, i) => [
          ...sums,
          i === 0 ? start : sums[i - 1] + arcLength(segment, ts[i - 1], t),
        ],
        [],
      );
      const added = ts
        .map((t, i) => ({ point: segment.at(t), along: alongs[i] }))
        .slice(index === 0 ? 0 : 1);
      const next = [...samples, ...added];
      return {
        samples: next,
        joins:
          index < segments.length - 1 ? [...joins, next.length - 1] : joins,
      };
    },
    { samples: [], joins: [] },
  );

const ON_AXIS_MM = 1e-9;

/**
 * Where a pointed end's offset surface leaves the axis, carry it on along its
 * tangent until it meets the axis again, as a cone's tip moves up for
 * thickness. Returns the extra length and the axis point.
 */
const tipExtension = (
  segment: ProfileSegment,
  original: ProfileSegment,
  t: 0 | 1,
) => {
  const [r, y] = segment.at(t);
  if (original.at(t)[0] > ON_AXIS_MM || r <= ON_AXIS_MM) return undefined;
  const [dr, dy] = tangentAt(segment, t);
  // Back along the tangent from the top, onwards from the bottom.
  const direction = t === 0 ? -1 : 1;
  if (Math.abs(dr) < ON_AXIS_MM) return undefined;
  const distance = Math.abs(r / dr);
  return {
    length: distance,
    point: [0, y + direction * dy * distance] as ProfilePoint,
  };
};

export interface Gore {
  /** The gore's right-hand edge, from the top of the profile down. */
  right: Polyline;
  left: Polyline;
  outline: Polyline;
  length: number;
  /** Distance along the seam to each join between segments. */
  joins: Array<number>;
  /** Half the gore's width at each join. */
  joinHalfWidths: Array<number>;
  widest: number;
  /** The inside profile from the bottom up, for the lathe model. */
  profile: Array<ProfilePoint>;
}

/**
 * One gore of a surface of revolution. Each point along the seam is as far
 * along the gore as it is along the profile, and the gore is as wide there as
 * that circle of latitude shared between all the gores. Sizes are taken at
 * the middle of the material: the profile is moved out half the thickness.
 */
export const profileGore = (
  segments: Array<ProfileSegment>,
  gores: number,
  thicknessMm: number,
): Gore => {
  const mids = segments.map(segment => offsetSegment(segment, thicknessMm / 2));
  const { samples, joins } = sampleSegments(mids);
  const top = tipExtension(mids[0], segments[0], 0);
  const bottom = tipExtension(
    mids[mids.length - 1],
    segments[segments.length - 1],
    1,
  );
  const shift = top?.length ?? 0;
  const last = samples[samples.length - 1];
  const extended: Array<Sample> = [
    ...(top ? [{ point: top.point, along: 0 }] : []),
    ...samples.map(({ point, along }) => ({ point, along: along + shift })),
    ...(bottom
      ? [{ point: bottom.point, along: last.along + shift + bottom.length }]
      : []),
  ];
  const halfWidth = (radius: number) => (Math.PI * radius) / gores;
  const right = extended.map(
    ({ point, along }) => [halfWidth(point[0]), along] as const,
  );
  const left = right.map(([x, y]) => [-x, y] as const).reverse();
  const closesAtTop = right[0][0] < ON_AXIS_MM;
  const closesAtBottom = right[right.length - 1][0] < ON_AXIS_MM;
  const outline = [
    ...right,
    ...left.slice(closesAtBottom ? 1 : 0, closesAtTop ? -1 : undefined),
  ];
  const joinOffset = top ? 1 : 0;
  const insideSamples = sampleSegments(segments).samples;
  return {
    right,
    left,
    outline,
    length: right[right.length - 1][1],
    joins: joins.map(index => right[index + joinOffset][1]),
    joinHalfWidths: joins.map(index => right[index + joinOffset][0]),
    widest: Math.max(...right.map(([x]) => x * 2)),
    profile: insideSamples.map(({ point }) => point).reverse(),
  };
};
