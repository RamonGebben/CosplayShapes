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
import type {
  BuildInput,
  BuildResult,
  ModelLine,
  Piece,
  Polyline,
} from './types';

const QUARTERS = [0.25, 0.5, 0.75];

const isTabbed = (input: BuildInput) => input.material.join === 'tabbed';

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
const caps = (
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

const MIN_TAPER_MM = 1;

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

/**
 * One gore of a sphere of this radius, from its tip down to the polar angle
 * reached, with the classic orange-peel width: the circle of latitude at each
 * point shared between the gores.
 */
const gore = (radius: number, polar: number, gores: number) => {
  const goreLength = radius * polar;
  // Even, so the sphere's equator (its widest point) is a sample.
  const samples = 2 * Math.max(12, Math.ceil(goreLength / 6));
  const halfWidth = (along: number) =>
    (Math.PI * radius * Math.sin(along / radius)) / gores;
  const right = steps(0, goreLength, samples).map(
    along => [halfWidth(along), along] as const,
  );
  const left = right.map(([x, y]) => [-x, y] as const).reverse();
  const closesAtTip = Math.abs(polar - Math.PI) < 1e-9;
  const outline = closesAtTip
    ? [...right, ...left.slice(1, -1)]
    : [...right, ...left.slice(0, -1)];
  return { goreLength, right, left, outline, halfWidth };
};

export const dome = (input: BuildInput): BuildResult => {
  const { circumference, height, gores } = input.dims;
  const baseRadius = radiusOf(circumference);
  const sphereRadius = (baseRadius ** 2 + height ** 2) / (2 * height);
  const polar = Math.acos((sphereRadius - height) / sphereRadius);
  const midRadius = sphereRadius + input.thicknessMm / 2;
  const { goreLength, right, left, outline, halfWidth } = gore(
    midRadius,
    polar,
    gores,
  );
  const widest = Math.max(...right.map(([x]) => x * 2));
  const piece = makePiece({
    id: 'A',
    name: 'Gore',
    cut: gores,
    outline,
    edges: [
      { keys: ['seam', 'height'], points: right },
      { keys: ['seam', 'height'], points: left },
      {
        keys: ['circumference'],
        points: [right[right.length - 1], left[0]],
      },
    ],
    notches: [notchAlong(right, 0.5, outline), notchAlong(left, 0.5, outline)],
    seamMm: input.seamMm,
  });
  const centreY = height - sphereRadius;
  const profile = steps(polar, 0, 48).map(
    angle =>
      [
        sphereRadius * Math.sin(angle),
        centreY + sphereRadius * Math.cos(angle),
      ] as const,
  );
  return {
    ok: true,
    pattern: {
      pieces: [piece],
      facts: [
        { label: 'Gore length', lengths: [goreLength] },
        { label: 'Widest point', lengths: [widest] },
        { label: 'Width at the base', lengths: [halfWidth(goreLength) * 2] },
      ],
      notes: [],
      model: {
        kind: 'lathe',
        profile,
        lines: [
          { keys: ['circumference'], points: ring(baseRadius, 0) },
          ...range(gores).map(index =>
            meridian(profile, (TAU * index) / gores, ['seam', 'height']),
          ),
        ],
      },
    },
  };
};

export const sphere = (input: BuildInput): BuildResult => {
  const { circumference, gores } = input.dims;
  const radius = radiusOf(circumference);
  const midRadius = radius + input.thicknessMm / 2;
  const { goreLength, right, left, outline } = gore(midRadius, Math.PI, gores);
  const equator = goreLength / 2;
  const width = (Math.PI * midRadius * 2) / gores;
  const piece = makePiece({
    id: 'A',
    name: 'Gore',
    cut: gores,
    outline,
    edges: [
      { keys: ['seam'], points: right },
      { keys: ['seam'], points: left },
      {
        keys: ['circumference'],
        points: [
          [width / 2, equator],
          [-width / 2, equator],
        ],
      },
    ],
    notches: [notchAlong(right, 0.5, outline), notchAlong(left, 0.5, outline)],
    seamMm: input.seamMm,
  });
  const profile = steps(Math.PI, 0, 64).map(
    angle =>
      [radius * Math.sin(angle), radius + radius * Math.cos(angle)] as const,
  );
  return {
    ok: true,
    pattern: {
      pieces: [piece],
      facts: [
        { label: 'Gore length', lengths: [goreLength] },
        { label: 'Widest point', lengths: [width] },
        { label: 'Diameter', lengths: [radius * 2] },
      ],
      notes: [],
      model: {
        kind: 'lathe',
        profile,
        lines: [
          { keys: ['circumference'], points: ring(radius, radius) },
          ...range(gores).map(index =>
            meridian(profile, (TAU * index) / gores, ['seam']),
          ),
        ],
      },
    },
  };
};
