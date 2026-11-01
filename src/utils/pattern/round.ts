import {
  TAU,
  arc,
  arcSamples,
  bounds,
  degrees,
  letter,
  makePiece,
  notch,
  notchAlong,
  radiusOf,
  range,
  rect,
  ring,
  steps,
} from './geometry';
import {
  circular,
  elliptical,
  line,
  profileGore,
  type Gore,
  type ProfileSegment,
} from './profile';
import type {
  BuildInput,
  BuildResult,
  Fact,
  ModelLine,
  Piece,
  Polyline,
} from './types';

export const QUARTERS = [0.25, 0.5, 0.75];

export const isTabbed = (input: BuildInput) => input.material.join === 'tabbed';

/** A lathe meridian: the profile swept to one angle around the axis. */
const meridian = (
  profile: Array<readonly [number, number]>,
  angle: number,
  keys: Array<string>,
): ModelLine => ({
  keys,
  points: profile.map(
    ([radius, y]) =>
      [radius * Math.sin(angle), y, radius * Math.cos(angle)] as const,
  ),
});

/** Round end caps. Foam caps sit inside the wall, so they keep the inside size. */
export const caps = (
  input: BuildInput,
  radii: Array<{ radius: number; key: string; name: string }>,
  firstIndex: number,
): Array<Piece> => {
  const insideCap = input.material.join === 'butt';
  const merged = radii.length === 2 && radii[0].radius === radii[1].radius;
  const list = merged ? [{ ...radii[0], name: 'End cap' }] : radii;
  return list.map(({ radius, key, name }, index) => {
    const capRadius = insideCap ? radius : radius + input.thicknessMm / 2;
    const outline = arc(capRadius, 0, TAU, arcSamples(capRadius, TAU)).slice(
      0,
      -1,
    );
    return makePiece({
      id: letter(firstIndex + index),
      name,
      cut: merged ? 2 : 1,
      outline,
      edges: [{ keys: [key], points: [...outline, outline[0]] }],
      notches: [0, 0.25, 0.5, 0.75].map(at =>
        notchAlong([...outline, outline[0]], at, outline),
      ),
      seamMm: input.seamMm,
    });
  });
};

/**
 * Splits a straight edge into short spans so card patterns can carry a row of
 * small fold-in tabs along it.
 */
const spans = (from: number, to: number, y: number): Polyline => {
  const count = Math.max(2, Math.round(Math.abs(to - from) / 20));
  return steps(from, to, count).map(x => [x, y] as const);
};

export const cylinder = (input: BuildInput): BuildResult => {
  const { circumference, height } = input.dims;
  const radius = radiusOf(circumference);
  const midRadius = radius + input.thicknessMm / 2;
  const width = TAU * midRadius;
  const ends = Boolean(input.options.ends);
  const tabbedEnds = ends && isTabbed(input);
  const top = tabbedEnds ? spans(0, width, 0) : rect(width, height).slice(0, 2);
  const bottom = tabbedEnds
    ? spans(width, 0, height)
    : rect(width, height).slice(2, 4);
  const outline = [...top, ...bottom];
  const seamTab = top.length - 1;
  const capTabs = tabbedEnds
    ? [
        ...range(top.length - 1).filter(index => index % 2 === 0),
        ...range(bottom.length - 1)
          .filter(index => index % 2 === 0)
          .map(index => top.length + index),
      ]
    : [];
  const wrap = makePiece({
    id: 'A',
    name: 'Wrap',
    cut: 1,
    outline,
    edges: [
      { keys: ['circumference'], points: [top[0], top[top.length - 1]] },
      {
        keys: ['circumference'],
        points: [bottom[0], bottom[bottom.length - 1]],
      },
      { keys: ['height', 'seam'], points: [top[top.length - 1], bottom[0]] },
      { keys: ['height', 'seam'], points: [bottom[bottom.length - 1], top[0]] },
    ],
    notches: QUARTERS.flatMap(at => [
      notch(top[0], top[top.length - 1], at, outline),
      notch(bottom[0], bottom[bottom.length - 1], at, outline),
    ]),
    tabs: isTabbed(input) ? [seamTab, ...capTabs] : [],
    seamMm: input.seamMm,
  });
  const profile = [
    ...(ends ? [[0, 0] as const] : []),
    [radius, 0] as const,
    [radius, height] as const,
    ...(ends ? [[0, height] as const] : []),
  ];
  return {
    ok: true,
    pattern: {
      pieces: [
        wrap,
        ...(ends
          ? caps(
              input,
              [
                { radius, key: 'circumference', name: 'Top cap' },
                { radius, key: 'circumference', name: 'Bottom cap' },
              ],
              1,
            )
          : []),
      ],
      facts: [
        { label: 'Wrap length', lengths: [width] },
        { label: 'Diameter', lengths: [radius * 2] },
      ],
      notes: [],
      model: {
        kind: 'lathe',
        profile,
        lines: [
          { keys: ['circumference'], points: ring(radius, 0) },
          { keys: ['circumference'], points: ring(radius, height) },
          meridian(
            [
              [radius, 0],
              [radius, height],
            ],
            0,
            ['height', 'seam'],
          ),
        ],
      },
    },
  };
};

/**
 * The flat piece of a cone wall: an annular sector between two radii, centred
 * so its arcs bow upwards. An inner radius of 0 makes the full cone's sector.
 */
const sector = (outer: number, inner: number, sweep: number) => {
  const outerArc = arc(outer, -sweep / 2, sweep / 2, arcSamples(outer, sweep));
  const innerArc =
    inner > 0
      ? arc(inner, sweep / 2, -sweep / 2, arcSamples(inner, sweep))
      : [[0, 0] as const];
  return { outerArc, innerArc, outline: [...outerArc, ...innerArc] };
};

/** Horizontal shift of a slanted wall moved half the thickness along its normal. */
const wallOffset = (input: BuildInput, slant: number, height: number) =>
  ((input.thicknessMm / 2) * slant) / height;

export const cone = (input: BuildInput): BuildResult => {
  const { circumference, height } = input.dims;
  const radius = radiusOf(circumference);
  const midRadius =
    radius + wallOffset(input, Math.hypot(radius, height), height);
  const midHeight = (midRadius * height) / radius;
  const slant = Math.hypot(midRadius, midHeight);
  const sweep = (TAU * midRadius) / slant;
  const { outerArc, outline } = sector(slant, 0, sweep);
  const ends = Boolean(input.options.ends);
  const wall = makePiece({
    id: 'A',
    name: 'Wall',
    cut: 1,
    outline,
    edges: [
      { keys: ['circumference'], points: outerArc },
      {
        keys: ['height', 'seam'],
        points: [outerArc[outerArc.length - 1], [0, 0]],
      },
      { keys: ['height', 'seam'], points: [[0, 0], outerArc[0]] },
    ],
    notches: QUARTERS.map(at => notchAlong(outerArc, at, outline)),
    tabs: isTabbed(input) ? [outerArc.length - 1] : [],
    seamMm: input.seamMm,
  });
  const profile = [
    ...(ends ? [[0, 0] as const] : []),
    [radius, 0] as const,
    [0, height] as const,
  ];
  return {
    ok: true,
    pattern: {
      pieces: [
        wall,
        ...(ends
          ? caps(input, [{ radius, key: 'circumference', name: 'Base' }], 1)
          : []),
      ],
      facts: [
        { label: 'Seam length', lengths: [slant] },
        { label: 'Arc angle', degrees: degrees(sweep) },
        { label: 'Diameter', lengths: [radius * 2] },
      ],
      notes: [],
      model: {
        kind: 'lathe',
        profile,
        lines: [
          { keys: ['circumference'], points: ring(radius, 0) },
          meridian(
            [
              [radius, 0],
              [0, height],
            ],
            0,
            ['height', 'seam'],
          ),
        ],
      },
    },
  };
};

export const MIN_TAPER_MM = 1;

export const truncatedCone = (input: BuildInput): BuildResult => {
  const { top, bottom, height } = input.dims;
  const topRadius = radiusOf(top);
  const bottomRadius = radiusOf(bottom);
  if (Math.abs(top - bottom) < MIN_TAPER_MM)
    return {
      ok: false,
      field: 'top',
      message:
        'Top and bottom are the same size, so this is a cylinder. Use the Cylinder pattern instead.',
    };
  const wideIsBottom = bottomRadius > topRadius;
  const wide = Math.max(topRadius, bottomRadius);
  const narrow = Math.min(topRadius, bottomRadius);
  const slant = Math.hypot(wide - narrow, height);
  const offset = wallOffset(input, slant, height);
  const midWide = wide + offset;
  const midNarrow = narrow + offset;
  const outer = (midWide * slant) / (midWide - midNarrow);
  const inner = outer - slant;
  const sweep = (TAU * midWide) / outer;
  const { outerArc, innerArc, outline } = sector(outer, inner, sweep);
  const wideKey = wideIsBottom ? 'bottom' : 'top';
  const narrowKey = wideIsBottom ? 'top' : 'bottom';
  const ends = Boolean(input.options.ends);
  const wall = makePiece({
    id: 'A',
    name: 'Wall',
    cut: 1,
    outline,
    edges: [
      { keys: [wideKey], points: outerArc },
      { keys: [narrowKey], points: innerArc },
      {
        keys: ['height', 'seam'],
        points: [outerArc[outerArc.length - 1], innerArc[0]],
      },
      {
        keys: ['height', 'seam'],
        points: [innerArc[innerArc.length - 1], outerArc[0]],
      },
    ],
    notches: QUARTERS.flatMap(at => [
      notchAlong(outerArc, at, outline),
      notchAlong(innerArc, at, outline),
    ]),
    tabs: isTabbed(input) ? [outerArc.length - 1] : [],
    seamMm: input.seamMm,
  });
  const piece = bounds(wall.outline);
  return {
    ok: true,
    pattern: {
      pieces: [
        wall,
        ...(ends
          ? caps(
              input,
              [
                { radius: topRadius, key: 'top', name: 'Top cap' },
                { radius: bottomRadius, key: 'bottom', name: 'Bottom cap' },
              ],
              1,
            )
          : []),
      ],
      facts: [
        { label: 'Seam length', lengths: [slant] },
        { label: 'Arc angle', degrees: degrees(sweep) },
        { label: 'Outer radius', lengths: [outer] },
        { label: 'Piece size', lengths: [piece.width, piece.height] },
      ],
      notes: [],
      model: {
        kind: 'lathe',
        profile: [
          ...(ends ? [[0, 0] as const] : []),
          [bottomRadius, 0] as const,
          [topRadius, height] as const,
          ...(ends ? [[0, height] as const] : []),
        ],
        lines: [
          { keys: ['bottom'], points: ring(bottomRadius, 0) },
          { keys: ['top'], points: ring(topRadius, height) },
          meridian(
            [
              [bottomRadius, 0],
              [topRadius, height],
            ],
            0,
            ['height', 'seam'],
          ),
        ],
      },
    },
  };
};

interface GoredSpec {
  segments: Array<ProfileSegment>;
  gores: number;
  /** Keys for the seams, which also run the length of the shape. */
  sideKeys: Array<string>;
  /** Keys for the open bottom edge, when the profile doesn't close there. */
  rimKey?: string;
  /** Lines across the gore at joins between segments, such as an equator. */
  across?: Array<{ join: number; keys: Array<string> }>;
  /** Notch the seams at every join as well as halfway. */
  notchJoins?: boolean;
  facts: (gore: Gore) => Array<Fact>;
}

/** A gored pattern and its lathe model from a profile drawn top down. */
const goredPattern = (
  input: BuildInput,
  {
    segments,
    gores,
    sideKeys,
    rimKey,
    across = [],
    notchJoins = false,
    facts,
  }: GoredSpec,
): BuildResult => {
  const gore = profileGore(segments, gores, input.thicknessMm);
  const { right, left, outline, length, joins, joinHalfWidths } = gore;
  const notchAt = [
    0.5,
    ...(notchJoins
      ? joins
          .map(along => along / length)
          .filter(at => Math.abs(at - 0.5) > 0.01)
      : []),
  ];
  const piece = makePiece({
    id: 'A',
    name: 'Gore',
    cut: gores,
    outline,
    edges: [
      { keys: sideKeys, points: right },
      { keys: sideKeys, points: left },
      ...(rimKey
        ? [{ keys: [rimKey], points: [right[right.length - 1], left[0]] }]
        : []),
      ...across.map(({ join, keys }) => ({
        keys,
        points: [
          [joinHalfWidths[join], joins[join]],
          [-joinHalfWidths[join], joins[join]],
        ] as Polyline,
      })),
    ],
    notches: notchAt.flatMap(at => [
      notchAlong(right, at, outline),
      notchAlong(left, at, outline),
    ]),
    seamMm: input.seamMm,
  });
  const { profile } = gore;
  const insideJoins = segmentJoins(segments);
  const [baseRadius, baseY] = profile[0];
  return {
    ok: true,
    pattern: {
      pieces: [piece],
      facts: facts(gore),
      notes: [],
      model: {
        kind: 'lathe',
        profile,
        lines: [
          ...(rimKey
            ? [{ keys: [rimKey], points: ring(baseRadius, baseY) }]
            : []),
          ...across.map(({ join, keys }) => ({
            keys,
            points: ring(...insideJoins[join]),
          })),
          ...range(gores).map(index =>
            meridian(profile, (TAU * index) / gores, sideKeys),
          ),
        ],
      },
    },
  };
};

/** Where each segment meets the next on the inside profile. */
const segmentJoins = (segments: Array<ProfileSegment>) =>
  segments.slice(0, -1).map(segment => segment.at(1));

const QUARTER = Math.PI / 2;

export const dome = (input: BuildInput): BuildResult => {
  const { circumference, height, gores } = input.dims;
  const baseRadius = radiusOf(circumference);
  const sphereRadius = (baseRadius ** 2 + height ** 2) / (2 * height);
  const polar = Math.acos((sphereRadius - height) / sphereRadius);
  const centre = [0, height - sphereRadius] as const;
  // Past a hemisphere the equator is the widest point, so make it a sample.
  const segments =
    polar > QUARTER
      ? [
          circular(centre, sphereRadius, 0, QUARTER),
          circular(centre, sphereRadius, QUARTER, polar),
        ]
      : [circular(centre, sphereRadius, 0, polar)];
  return goredPattern(input, {
    segments,
    gores,
    sideKeys: ['seam', 'height'],
    rimKey: 'circumference',
    facts: ({ length, widest, right }) => [
      { label: 'Gore length', lengths: [length] },
      { label: 'Widest point', lengths: [widest] },
      { label: 'Width at the base', lengths: [right[right.length - 1][0] * 2] },
    ],
  });
};

export const ovalDome = (input: BuildInput): BuildResult => {
  const { circumference, height, gores } = input.dims;
  const baseRadius = radiusOf(circumference);
  return goredPattern(input, {
    segments: [elliptical([0, 0], baseRadius, height, 0, QUARTER)],
    gores,
    sideKeys: ['seam', 'height'],
    rimKey: 'circumference',
    facts: ({ length, widest }) => [
      { label: 'Gore length', lengths: [length] },
      { label: 'Width at the base', lengths: [widest] },
      { label: 'Diameter', lengths: [baseRadius * 2] },
    ],
  });
};

export const pointedDome = (input: BuildInput): BuildResult => {
  const { circumference, height, gores } = input.dims;
  const baseRadius = radiusOf(circumference);
  if (height < baseRadius)
    return {
      ok: false,
      field: 'height',
      message:
        'A pointed dome is at least half as tall as it is wide. For a lower dome use the Oval dome.',
    };
  // A tangent ogive: one arc that leaves the rim straight up and meets the
  // axis in a point.
  const arcRadius = (baseRadius ** 2 + height ** 2) / (2 * baseRadius);
  const tip = Math.atan2(arcRadius - baseRadius, height);
  return goredPattern(input, {
    segments: [circular([baseRadius - arcRadius, 0], arcRadius, tip, QUARTER)],
    gores,
    sideKeys: ['seam', 'height'],
    rimKey: 'circumference',
    facts: ({ length, widest }) => [
      { label: 'Gore length', lengths: [length] },
      { label: 'Width at the base', lengths: [widest] },
      { label: 'Curve radius', lengths: [arcRadius] },
    ],
  });
};

export const sphere = (input: BuildInput): BuildResult => {
  const { circumference, gores } = input.dims;
  const radius = radiusOf(circumference);
  const centre = [0, radius] as const;
  return goredPattern(input, {
    segments: [
      circular(centre, radius, 0, QUARTER),
      circular(centre, radius, QUARTER, Math.PI),
    ],
    gores,
    sideKeys: ['seam'],
    across: [{ join: 0, keys: ['circumference'] }],
    facts: ({ length, widest }) => [
      { label: 'Gore length', lengths: [length] },
      { label: 'Widest point', lengths: [widest] },
      { label: 'Diameter', lengths: [radius * 2] },
    ],
  });
};

export const capsule = (input: BuildInput): BuildResult => {
  const { circumference, length, gores } = input.dims;
  const radius = radiusOf(circumference);
  if (length - radius * 2 < MIN_TAPER_MM)
    return {
      ok: false,
      field: 'length',
      message:
        'The length is no more than the diameter, so this is a sphere. Use the Sphere pattern instead.',
    };
  const upper = [0, length - radius] as const;
  const lower = [0, radius] as const;
  return goredPattern(input, {
    segments: [
      circular(upper, radius, 0, QUARTER),
      line([radius, length - radius], [radius, radius]),
      circular(lower, radius, QUARTER, Math.PI),
    ],
    gores,
    sideKeys: ['seam', 'length'],
    across: [
      { join: 0, keys: ['circumference'] },
      { join: 1, keys: ['circumference'] },
    ],
    notchJoins: true,
    facts: gore => [
      { label: 'Gore length', lengths: [gore.length] },
      { label: 'Widest point', lengths: [gore.widest] },
      { label: 'Straight middle', lengths: [length - radius * 2] },
    ],
  });
};
