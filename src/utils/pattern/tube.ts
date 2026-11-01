import {
  TAU,
  arcSamples,
  degrees,
  letter,
  makePiece,
  notch,
  notchAlong,
  radiusOf,
  range,
  steps,
} from './geometry';
import { MIN_TAPER_MM, QUARTERS, caps, isTabbed } from './round';
import type {
  BuildInput,
  BuildResult,
  ModelLine,
  Piece,
  Point,
  Polyline,
} from './types';

type Vertex = readonly [number, number, number];

/** Around the model's tubes; enough that flat facets still read as round. */
const AROUND = 64;

/**
 * Samples across a wrap, a multiple of four so the quarter points (the inside
 * seam, the sides and the outside of a cut) all land on samples.
 */
const wrapSamples = (width: number) => 4 * Math.max(12, Math.ceil(width / 12));

/** Notches where a sampled edge crosses each quarter of the wrap. */
const quarterNotches = (edge: Polyline, outline: Polyline) => {
  const count = edge.length - 1;
  return QUARTERS.map(at => {
    const index = Math.round(count * at);
    return notch(edge[index], edge[index + 1], 0, outline);
  });
};

/**
 * A closed ring of the 3D model around a centre, in the plane spanned by
 * `out` (stretched for a slanted cut) and the z axis. Angle 0 points along
 * `out`.
 */
const tubeRing = (
  centre: Vertex,
  out: readonly [number, number],
  radius: number,
  stretch: number,
): Array<Vertex> =>
  range(AROUND).map(index => {
    const angle = (TAU * index) / AROUND;
    const along = radius * Math.cos(angle) * stretch;
    return [
      centre[0] + out[0] * along,
      centre[1] + out[1] * along,
      radius * Math.sin(angle),
    ] as const;
  });

const closed = (ring: Array<Vertex>) => [...ring, ring[0]];

/** Quads joining each ring of a tube to the next. */
const tubeFaces = (rings: number) =>
  range(rings - 1).flatMap(ring =>
    range(AROUND).map(index => {
      const next = (index + 1) % AROUND;
      return [
        ring * AROUND + index,
        ring * AROUND + next,
        (ring + 1) * AROUND + next,
        (ring + 1) * AROUND + index,
      ];
    }),
  );

/** The line along a tube where its rings reach this angle. */
const tubeLine = (
  vertices: Array<Vertex>,
  rings: number,
  angleIndex: number,
  keys: Array<string>,
): ModelLine => ({
  keys,
  points: range(rings).map(ring => vertices[ring * AROUND + angleIndex]),
});

const ringLine = (
  vertices: Array<Vertex>,
  ring: number,
  keys: Array<string>,
): ModelLine => ({
  keys,
  points: closed(vertices.slice(ring * AROUND, (ring + 1) * AROUND)),
});

/**
 * The cap for a tube cut on a slant: an ellipse as wide as the tube and
 * longer along the slope.
 */
const slantedCap = (
  input: BuildInput,
  radius: number,
  slope: number,
  id: string,
): Piece => {
  const capRadius =
    input.material.join === 'butt' ? radius : radius + input.thicknessMm / 2;
  const long = capRadius * Math.hypot(1, slope);
  const count = arcSamples(long, TAU);
  const outline = range(count).map(index => {
    const angle = (TAU * index) / count;
    return [long * Math.sin(angle), -capRadius * Math.cos(angle)] as const;
  });
  const loop = [...outline, outline[0]];
  return makePiece({
    id,
    name: 'Top cap',
    cut: 1,
    outline,
    edges: [{ keys: ['top'], points: loop }],
    notches: [0, 0.25, 0.5, 0.75].map(at => notchAlong(loop, at, outline)),
    seamMm: input.seamMm,
  });
};

export const angledCylinder = (input: BuildInput): BuildResult => {
  const { circumference, short, tall } = input.dims;
  if (tall - short < MIN_TAPER_MM)
    return {
      ok: false,
      field: 'tall',
      message:
        'The tall side has to be taller than the short side. For a level top use the Cylinder.',
    };
  const radius = radiusOf(circumference);
  const midRadius = radius + input.thicknessMm / 2;
  const width = TAU * midRadius;
  const slope = (tall - short) / (2 * radius);
  const middle = (tall + short) / 2;
  // The seam is on the short side, so the cut rises to the tall side halfway.
  const heightAt = (x: number) =>
    middle - midRadius * slope * Math.cos((TAU * x) / width);
  const top = steps(0, width, wrapSamples(width)).map(
    x => [x, -heightAt(x)] as const,
  );
  const bottom: Polyline = [
    [width, 0],
    [0, 0],
  ];
  const outline = [...top, ...bottom];
  const ends = Boolean(input.options.ends);
  const wrap = makePiece({
    id: 'A',
    name: 'Wrap',
    cut: 1,
    outline,
    edges: [
      { keys: ['top'], points: top },
      { keys: ['circumference'], points: bottom },
      { keys: ['short', 'seam'], points: [top[top.length - 1], bottom[0]] },
      { keys: ['short', 'seam'], points: [bottom[1], top[0]] },
      {
        keys: ['tall'],
        points: [
          [width / 2, 0],
          [width / 2, -heightAt(width / 2)],
        ],
      },
    ],
    notches: [
      ...quarterNotches(top, outline),
      ...QUARTERS.map(at => notch(bottom[0], bottom[1], at, outline)),
    ],
    tabs: isTabbed(input) ? [top.length - 1] : [],
    seamMm: input.seamMm,
  });
  const vertices = [
    // Rings run the same way round as the elbow's, so faces point outwards.
    ...tubeRing([0, 0, 0], [-1, 0], radius, 1),
    ...range(AROUND).map(index => {
      const angle = (TAU * index) / AROUND;
      return [
        -radius * Math.cos(angle),
        middle + radius * slope * Math.cos(angle),
        radius * Math.sin(angle),
      ] as const;
    }),
  ];
  return {
    ok: true,
    pattern: {
      pieces: [
        wrap,
        ...(ends
          ? [
              ...caps(
                input,
                [{ radius, key: 'circumference', name: 'Bottom cap' }],
                1,
              ),
              slantedCap(input, radius, slope, letter(2)),
            ]
          : []),
      ],
      facts: [
        { label: 'Wrap length', lengths: [width] },
        { label: 'Top slopes at', degrees: degrees(Math.atan(slope)) },
        { label: 'Diameter', lengths: [radius * 2] },
      ],
      notes: [],
      model: {
        kind: 'solid',
        vertices,
        faces: [
          ...tubeFaces(2),
          ...(ends
            ? [range(AROUND).reverse(), range(AROUND).map(i => AROUND + i)]
            : []),
        ],
        lines: [
          ringLine(vertices, 0, ['circumference']),
          ringLine(vertices, 1, ['top']),
          tubeLine(vertices, 2, AROUND / 2, ['short', 'seam']),
          tubeLine(vertices, 2, 0, ['tall']),
        ],
      },
    },
  };
};

/** The most one joint of an elbow may turn: past it the cut folds over. */
const MAX_JOINT_DEGREES = 90;

/**
 * One section of an elbow unrolled, with the seam on the inside of the bend.
 * Each end is cut on a slant, longer on the outside; a slant of 0 is square.
 */
const sectionOutline = (
  width: number,
  midRadius: number,
  length: number,
  topSlant: number,
  bottomSlant: number,
) => {
  const xs = steps(0, width, wrapSamples(width));
  // cos is 1 on the outside of the bend, halfway across the wrap.
  const outside = (x: number) => -Math.cos((TAU * x) / width);
  const curve = (slant: number, y: number, sign: number) =>
    slant === 0
      ? [[0, y] as Point, [width, y] as Point]
      : xs.map(x => [x, y + sign * midRadius * slant * outside(x)] as Point);
  const top = curve(topSlant, 0, -1);
  const bottom = [...curve(bottomSlant, length, 1)].reverse();
  return { top, bottom, outline: [...top, ...bottom] };
};

export const elbow = (input: BuildInput): BuildResult => {
  const { circumference, bend, radius: bendRadius, sections } = input.dims;
  const radius = radiusOf(circumference);
  const midRadius = radius + input.thicknessMm / 2;
  const joints = sections - 1;
  const turn = bend / joints;
  if (turn > MAX_JOINT_DEGREES)
    return {
      ok: false,
      field: 'sections',
      message: `Use at least ${Math.ceil(bend / MAX_JOINT_DEGREES) + 1} sections: each joint can turn at most ${MAX_JOINT_DEGREES}°.`,
    };
  if (bendRadius - midRadius < MIN_TAPER_MM)
    return {
      ok: false,
      field: 'radius',
      message:
        'The bend is tighter than the tube is wide, so the inside would fold. Make the bend radius more than half the diameter.',
    };
  const half = (turn * Math.PI) / 360;
  const slant = Math.tan(half);
  const width = TAU * midRadius;
  const endLength = bendRadius * slant;
  const piece = (
    id: string,
    name: string,
    cut: number,
    length: number,
    topSlant: number,
  ) => {
    const { top, bottom, outline } = sectionOutline(
      width,
      midRadius,
      length,
      topSlant,
      slant,
    );
    const topKeys = topSlant === 0 ? ['circumference'] : ['joint'];
    return makePiece({
      id,
      name,
      cut,
      outline,
      edges: [
        { keys: topKeys, points: top },
        { keys: ['joint'], points: bottom },
        { keys: ['seam'], points: [top[top.length - 1], bottom[0]] },
        { keys: ['seam'], points: [bottom[bottom.length - 1], top[0]] },
      ],
      notches: [
        ...(topSlant === 0
          ? QUARTERS.map(at => notch(top[0], top[1], at, outline))
          : quarterNotches(top, outline)),
        ...quarterNotches(bottom, outline),
      ],
      tabs: isTabbed(input) ? [top.length - 1] : [],
      seamMm: input.seamMm,
    });
  };
  const middles = sections - 2;
  const pieces = [
    piece('A', 'End section', 2, endLength, 0),
    ...(middles > 0
      ? [piece('B', 'Middle section', middles, 2 * endLength, slant)]
      : []),
  ];
  // The bend turns about a centre bendRadius to the right of the start, so
  // the tube rises from the origin and curves over to the right.
  const turnRadians = (bend * Math.PI) / 180;
  const station = (angle: number, distance: number, stretch: number) => {
    const out = [-Math.cos(angle), Math.sin(angle)] as const;
    return tubeRing(
      [bendRadius + out[0] * distance, out[1] * distance, 0],
      out,
      radius,
      stretch,
    );
  };
  const stations = [
    station(0, bendRadius, 1),
    ...range(joints).map(index =>
      station(
        (index + 0.5) * ((turn * Math.PI) / 180),
        bendRadius / Math.cos(half),
        1 / Math.cos(half),
      ),
    ),
    station(turnRadians, bendRadius, 1),
  ];
  const rings = stations.length;
  const vertices = stations.flat();
  const outside = (bendRadius + midRadius) * slant * 2 * joints;
  const inside = (bendRadius - midRadius) * slant * 2 * joints;
  return {
    ok: true,
    pattern: {
      pieces,
      facts: [
        { label: 'Each joint turns', degrees: turn },
        { label: 'Length on the outside', lengths: [outside] },
        { label: 'Length on the inside', lengths: [inside] },
      ],
      notes: [
        'Line up the seams along the inside of the bend and the middle notches along the outside.',
      ],
      model: {
        kind: 'solid',
        vertices,
        faces: tubeFaces(rings),
        lines: [
          ringLine(vertices, 0, ['circumference']),
          ringLine(vertices, rings - 1, ['circumference']),
          ...range(joints).map(index =>
            ringLine(vertices, index + 1, ['joint']),
          ),
          tubeLine(vertices, rings, AROUND / 2, ['seam', 'radius', 'bend']),
        ],
      },
    },
  };
};
