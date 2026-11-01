import {
  TAU,
  arc,
  letter,
  makePiece,
  notch,
  range,
  rect,
  regularPolygon,
  shift,
} from './geometry';
import type {
  BuildInput,
  BuildResult,
  ModelLine,
  PatternEdge,
  Piece,
  Polyline,
} from './types';

type Vertex = readonly [number, number, number];

const isTabbed = (input: BuildInput) => input.material.join === 'tabbed';

/** Tags every edge of a polygon with the key for that edge. */
const tagEdges = (
  polygon: Polyline,
  keys: Array<Array<string>>,
): Array<PatternEdge> =>
  polygon.map((point, index) => ({
    keys: keys[index % keys.length],
    points: [point, polygon[(index + 1) % polygon.length]],
  }));

const midNotches = (polygon: Polyline) =>
  polygon.map((point, index) =>
    notch(point, polygon[(index + 1) % polygon.length], 0.5, polygon),
  );

interface FacePiece {
  name: string;
  cut: number;
  outline: Polyline;
  keys: Array<Array<string>>;
  tabs?: Array<number>;
}

const facePieces = (input: BuildInput, faces: Array<FacePiece>) =>
  faces.map(({ name, cut, outline, keys, tabs }, index): Piece =>
    makePiece({
      id: letter(index),
      name,
      cut,
      outline,
      edges: tagEdges(outline, keys),
      notches: midNotches(outline),
      tabs,
      seamMm: input.seamMm,
    }),
  );

const segmentLines = (
  vertices: Array<Vertex>,
  pairs: Array<[number, number, Array<string>]>,
): Array<ModelLine> =>
  pairs.map(([from, to, keys]) => ({
    keys,
    points: [vertices[from], vertices[to]],
  }));

const BUTT_BEVEL_NOTE =
  'Sizes are taken at the middle of the material. Bevel each edge at 45° so the faces meet at the corners.';

const flatNotes = (input: BuildInput) =>
  input.material.join === 'butt' && input.thicknessMm > 0
    ? [BUTT_BEVEL_NOTE]
    : [];

export const box = (input: BuildInput): BuildResult => {
  const { width, depth, height } = input.dims;
  const lid = Boolean(input.options.lid);
  const w = width + input.thicknessMm;
  const d = depth + input.thicknessMm;
  const h = height + input.thicknessMm;
  const pieces = isTabbed(input)
    ? [boxNet(input, w, d, h, lid)]
    : facePieces(input, [
        {
          name: 'Front and back',
          cut: 2,
          outline: rect(w, h),
          keys: [['width'], ['height']],
        },
        {
          name: 'Sides',
          cut: 2,
          outline: rect(d, h),
          keys: [['depth'], ['height']],
        },
        {
          name: lid ? 'Bottom and lid' : 'Bottom',
          cut: lid ? 2 : 1,
          outline: rect(w, d),
          keys: [['width'], ['depth']],
        },
      ]);
  const [x, z] = [width / 2, depth / 2];
  const vertices: Array<Vertex> = [
    [-x, 0, z],
    [x, 0, z],
    [x, 0, -z],
    [-x, 0, -z],
    [-x, height, z],
    [x, height, z],
    [x, height, -z],
    [-x, height, -z],
  ];
  return {
    ok: true,
    pattern: {
      pieces,
      facts: [
        { label: 'Front and back', lengths: [w, h] },
        { label: 'Sides', lengths: [d, h] },
        { label: lid ? 'Bottom and lid' : 'Bottom', lengths: [w, d] },
      ],
      notes: flatNotes(input),
      model: {
        kind: 'solid',
        vertices,
        faces: [
          [3, 2, 1, 0],
          [0, 1, 5, 4],
          [2, 3, 7, 6],
          [3, 0, 4, 7],
          [1, 2, 6, 5],
          ...(lid ? [[4, 5, 6, 7]] : []),
        ],
        lines: segmentLines(vertices, [
          [0, 1, ['width']],
          [3, 2, ['width']],
          [4, 5, ['width']],
          [7, 6, ['width']],
          [1, 2, ['depth']],
          [0, 3, ['depth']],
          [5, 6, ['depth']],
          [4, 7, ['depth']],
          [0, 4, ['height']],
          [1, 5, ['height']],
          [2, 6, ['height']],
          [3, 7, ['height']],
        ]),
      },
    },
  };
};

/**
 * The cross-shaped box net for card: bottom in the middle, sides left and
 * right, front above, back below and the lid hanging off the back.
 */
const boxNet = (
  input: BuildInput,
  w: number,
  d: number,
  h: number,
  lid: boolean,
): Piece => {
  const backEnd = 2 * h + d;
  const end = lid ? backEnd + d : backEnd;
  const lidEnd: Polyline = lid
    ? [
        [h + w, end],
        [h, end],
      ]
    : [];
  const outline: Polyline = [
    [h, 0],
    [h + w, 0],
    [h + w, h],
    [2 * h + w, h],
    [2 * h + w, h + d],
    [h + w, h + d],
    [h + w, backEnd],
    ...lidEnd,
    [h, backEnd],
    [h, h + d],
    [0, h + d],
    [0, h],
    [h, h],
  ];
  const indexOf = (x: number, y: number) =>
    outline.findIndex(([px, py]) => px === x && py === y);
  const tabs = [
    indexOf(h + w, 0),
    indexOf(h + w, h + d),
    indexOf(h, backEnd),
    indexOf(h, h),
    ...(lid
      ? [indexOf(h + w, backEnd), indexOf(h + w, end), indexOf(h, end)]
      : []),
  ];
  const folds: Array<Polyline> = [
    [
      [h, h],
      [h + w, h],
    ],
    [
      [h, h + d],
      [h + w, h + d],
    ],
    [
      [h, h],
      [h, h + d],
    ],
    [
      [h + w, h],
      [h + w, h + d],
    ],
    ...(lid
      ? [
          [
            [h, backEnd],
            [h + w, backEnd],
          ] as Polyline,
        ]
      : []),
  ];
  return makePiece({
    id: 'A',
    name: 'Box net',
    cut: 1,
    outline,
    edges: [
      {
        keys: ['width'],
        points: [
          [h, 0],
          [h + w, 0],
        ],
      },
      {
        keys: ['width'],
        points: [
          [h, end],
          [h + w, end],
        ],
      },
      {
        keys: ['depth'],
        points: [
          [0, h],
          [0, h + d],
        ],
      },
      {
        keys: ['depth'],
        points: [
          [2 * h + w, h],
          [2 * h + w, h + d],
        ],
      },
      {
        keys: ['height'],
        points: [
          [h, 0],
          [h, h],
        ],
      },
      {
        keys: ['height'],
        points: [
          [h + w, 0],
          [h + w, h],
        ],
      },
      {
        keys: ['height'],
        points: [
          [0, h],
          [h, h],
        ],
      },
      {
        keys: ['height'],
        points: [
          [h + w, h],
          [2 * h + w, h],
        ],
      },
    ],
    folds,
    tabs,
    seamMm: input.seamMm,
  });
};

const triangle = (base: number, altitude: number): Polyline => [
  [0, altitude],
  [base / 2, 0],
  [base, altitude],
];

export const pyramid = (input: BuildInput): BuildResult => {
  const { width, depth, height } = input.dims;
  const withBase = Boolean(input.options.base);
  const w = width + input.thicknessMm;
  const d = depth + input.thicknessMm;
  const h = (height * (w / width + d / depth)) / 2;
  const frontAltitude = Math.hypot(h, d / 2);
  const sideAltitude = Math.hypot(h, w / 2);
  const slantEdge = Math.hypot(h, w / 2, d / 2);
  const square = Math.abs(w - d) < 0.01;
  const base: Array<FacePiece> = withBase
    ? [
        {
          name: 'Base',
          cut: 1,
          outline: rect(w, d),
          keys: [['width'], ['depth']],
          tabs: isTabbed(input) ? [0, 1, 2, 3] : [],
        },
      ]
    : [];
  const pieces = isTabbed(input)
    ? [pyramidFan(input, w, d, slantEdge), ...facePieces(input, base)]
    : facePieces(input, [
        ...(square
          ? [
              {
                name: 'Faces',
                cut: 4,
                outline: triangle(w, frontAltitude),
                keys: [['height'], ['height'], ['width', 'depth']],
              },
            ]
          : [
              {
                name: 'Front and back',
                cut: 2,
                outline: triangle(w, frontAltitude),
                keys: [['height'], ['height'], ['width']],
              },
              {
                name: 'Sides',
                cut: 2,
                outline: triangle(d, sideAltitude),
                keys: [['height'], ['height'], ['depth']],
              },
            ]),
        ...base,
      ]);
  const relettered = pieces.map((piece, index) => ({
    ...piece,
    id: letter(index),
  }));
  const [x, z] = [width / 2, depth / 2];
  const vertices: Array<Vertex> = [
    [-x, 0, z],
    [x, 0, z],
    [x, 0, -z],
    [-x, 0, -z],
    [0, height, 0],
  ];
  return {
    ok: true,
    pattern: {
      pieces: relettered,
      facts: [
        { label: 'Corner edge', lengths: [slantEdge] },
        { label: 'Front face height', lengths: [frontAltitude] },
        { label: 'Side face height', lengths: [sideAltitude] },
      ],
      notes: flatNotes(input),
      model: {
        kind: 'solid',
        vertices,
        faces: [
          ...(withBase ? [[3, 2, 1, 0]] : []),
          [0, 1, 4],
          [1, 2, 4],
          [2, 3, 4],
          [3, 0, 4],
        ],
        lines: segmentLines(vertices, [
          [0, 1, ['width']],
          [3, 2, ['width']],
          [1, 2, ['depth']],
          [0, 3, ['depth']],
          [0, 4, ['height']],
          [1, 4, ['height']],
          [2, 4, ['height']],
          [3, 4, ['height']],
        ]),
      },
    },
  };
};

/** The four faces of a pyramid fanned out around the apex, for card. */
const pyramidFan = (
  input: BuildInput,
  w: number,
  d: number,
  slantEdge: number,
): Piece => {
  const chords = [w, d, w, d];
  const angles = chords.map(chord => 2 * Math.asin(chord / (2 * slantEdge)));
  const total = angles.reduce((sum, angle) => sum + angle, 0);
  const corners = [0, ...angles].map(
    (_, index) =>
      -total / 2 +
      angles.slice(0, index).reduce((sum, angle) => sum + angle, 0),
  );
  const rim = corners.map(angle => arc(slantEdge, angle, angle, 1)[0]);
  const apex = [0, 0] as const;
  const outline: Polyline = [apex, ...rim];
  return makePiece({
    id: 'A',
    name: 'Faces',
    cut: 1,
    outline,
    edges: [
      { keys: ['height'], points: [apex, rim[0]] },
      { keys: ['height'], points: [rim[rim.length - 1], apex] },
      ...chords.map((_, index) => ({
        keys: [index % 2 === 0 ? 'width' : 'depth'],
        points: [rim[index], rim[index + 1]],
      })),
    ],
    folds: rim.slice(1, -1).map(point => [apex, point]),
    notches: chords.map((_, index) =>
      notch(rim[index], rim[index + 1], 0.5, outline),
    ),
    tabs: [outline.length - 1],
    seamMm: input.seamMm,
  });
};

export const prism = (input: BuildInput): BuildResult => {
  const { sides, face, length } = input.dims;
  const ends = Boolean(input.options.ends);
  const inradius = face / (2 * Math.tan(Math.PI / sides));
  const midFace =
    2 * (inradius + input.thicknessMm / 2) * Math.tan(Math.PI / sides);
  const capSide = input.material.join === 'butt' ? face : midFace;
  const cap: FacePiece = {
    name: 'End caps',
    cut: 2,
    outline: regularPolygon(sides, capSide),
    keys: [['face']],
    tabs: isTabbed(input) ? range(sides) : [],
  };
  const pieces = isTabbed(input)
    ? [
        prismStrip(input, sides, midFace, length),
        ...(ends ? facePieces(input, [cap]) : []),
      ]
    : facePieces(input, [
        {
          name: 'Faces',
          cut: sides,
          outline: rect(midFace, length),
          keys: [['face'], ['length', 'seam']],
        },
        ...(ends ? [cap] : []),
      ]);
  const relettered = pieces.map((piece, index) => ({
    ...piece,
    id: letter(index),
  }));
  const circumradius = face / (2 * Math.sin(Math.PI / sides));
  const corner = (index: number, y: number): Vertex => {
    const angle = (TAU * index) / sides + Math.PI / sides;
    return [circumradius * Math.sin(angle), y, circumradius * Math.cos(angle)];
  };
  const vertices = [
    ...range(sides).map(index => corner(index, 0)),
    ...range(sides).map(index => corner(index, length)),
  ];
  const next = (index: number) => (index + 1) % sides;
  return {
    ok: true,
    pattern: {
      pieces: relettered,
      facts: [
        { label: 'Face', lengths: [midFace, length] },
        { label: 'Across the flats', lengths: [inradius * 2] },
      ],
      notes: flatNotes(input),
      model: {
        kind: 'solid',
        vertices,
        faces: [
          ...range(sides).map(index => [
            index,
            next(index),
            sides + next(index),
            sides + index,
          ]),
          ...(ends
            ? [range(sides).reverse(), range(sides).map(index => sides + index)]
            : []),
        ],
        lines: segmentLines(vertices, [
          ...range(sides).map(
            index =>
              [index, next(index), ['face']] as [number, number, Array<string>],
          ),
          ...range(sides).map(
            index =>
              [sides + index, sides + next(index), ['face']] as [
                number,
                number,
                Array<string>,
              ],
          ),
          ...range(sides).map(
            index =>
              [index, sides + index, ['length', 'seam']] as [
                number,
                number,
                Array<string>,
              ],
          ),
        ]),
      },
    },
  };
};

/** Every face of the prism side by side with fold lines between, for card. */
const prismStrip = (
  input: BuildInput,
  sides: number,
  face: number,
  length: number,
): Piece => {
  const xs = range(sides + 1).map(index => index * face);
  const top = xs.map(x => [x, 0] as const);
  const bottom = [...xs].reverse().map(x => [x, length] as const);
  const outline = [...top, ...bottom];
  return makePiece({
    id: 'A',
    name: 'Faces',
    cut: 1,
    outline,
    edges: [
      ...range(sides).flatMap(index => [
        { keys: ['face'], points: [top[index], top[index + 1]] },
        {
          keys: ['face'],
          points: shift([top[index], top[index + 1]], 0, length),
        },
      ]),
      { keys: ['length', 'seam'], points: [top[0], [0, length]] },
      { keys: ['length', 'seam'], points: [top[sides], [xs[sides], length]] },
    ],
    folds: xs.slice(1, -1).map(x => [
      [x, 0],
      [x, length],
    ]),
    notches: range(sides).flatMap(index => [
      notch(top[index], top[index + 1], 0.5, outline),
    ]),
    tabs: [sides],
    seamMm: input.seamMm,
  });
};

const MIN_TAPER_MM = 1;

export const taperedPrism = (input: BuildInput): BuildResult => {
  const { sides, top, bottom, height } = input.dims;
  if (Math.abs(top - bottom) < MIN_TAPER_MM)
    return {
      ok: false,
      field: 'top',
      message:
        'Top and bottom faces are the same width, so this is a prism. Use the Prism pattern instead.',
    };
  const ends = Boolean(input.options.ends);
  const toInradius = (face: number) => face / (2 * Math.tan(Math.PI / sides));
  const toFace = (inradius: number) => 2 * inradius * Math.tan(Math.PI / sides);
  const wideIsBottom = bottom > top;
  const wide = toInradius(Math.max(top, bottom));
  const narrow = toInradius(Math.min(top, bottom));
  const faceHeight = Math.hypot(height, wide - narrow);
  // A slanted face moved half the thickness along its normal, as on a cone.
  const offset = ((input.thicknessMm / 2) * faceHeight) / height;
  const midWide = toFace(wide + offset);
  const midNarrow = toFace(narrow + offset);
  const wideKey = wideIsBottom ? 'bottom' : 'top';
  const narrowKey = wideIsBottom ? 'top' : 'bottom';
  const insideCap = input.material.join === 'butt';
  const capFor = (
    face: number,
    midFace: number,
    key: string,
    name: string,
  ) => ({
    name,
    cut: 1,
    outline: regularPolygon(sides, insideCap ? face : midFace),
    keys: [[key]],
    tabs: isTabbed(input) ? range(sides) : [],
  });
  const caps: Array<FacePiece> = ends
    ? [
        capFor(
          bottom,
          wideIsBottom ? midWide : midNarrow,
          'bottom',
          'Bottom cap',
        ),
        capFor(top, wideIsBottom ? midNarrow : midWide, 'top', 'Top cap'),
      ]
    : [];
  const trapezoid: Polyline = [
    [(midWide - midNarrow) / 2, 0],
    [(midWide + midNarrow) / 2, 0],
    [midWide, faceHeight],
    [0, faceHeight],
  ];
  const pieces = isTabbed(input)
    ? [
        taperedStrip(input, sides, midWide, midNarrow, faceHeight, {
          wideKey,
          narrowKey,
        }),
        ...facePieces(input, caps),
      ]
    : facePieces(input, [
        {
          name: 'Faces',
          cut: sides,
          // Narrow end up, so the face reads the way it stands.
          outline: trapezoid,
          keys: [
            [narrowKey],
            ['height', 'seam'],
            [wideKey],
            ['height', 'seam'],
          ],
        },
        ...caps,
      ]);
  const relettered = pieces.map((piece, index) => ({
    ...piece,
    id: letter(index),
  }));
  const circumradius = (face: number) => face / (2 * Math.sin(Math.PI / sides));
  const corner = (index: number, y: number, face: number): Vertex => {
    const angle = (TAU * index) / sides + Math.PI / sides;
    const radius = circumradius(face);
    return [radius * Math.sin(angle), y, radius * Math.cos(angle)];
  };
  const vertices = [
    ...range(sides).map(index => corner(index, 0, bottom)),
    ...range(sides).map(index => corner(index, height, top)),
  ];
  const next = (index: number) => (index + 1) % sides;
  const cornerEdge = Math.hypot(
    height,
    circumradius(midWide) - circumradius(midNarrow),
  );
  return {
    ok: true,
    pattern: {
      pieces: relettered,
      facts: [
        { label: 'Face', lengths: [midWide, midNarrow, faceHeight] },
        { label: 'Corner edge', lengths: [cornerEdge] },
        {
          label: 'Across the flats',
          lengths: [2 * toInradius(bottom), 2 * toInradius(top)],
        },
      ],
      notes: flatNotes(input),
      model: {
        kind: 'solid',
        vertices,
        faces: [
          ...range(sides).map(index => [
            index,
            next(index),
            sides + next(index),
            sides + index,
          ]),
          ...(ends
            ? [range(sides).reverse(), range(sides).map(index => sides + index)]
            : []),
        ],
        lines: segmentLines(vertices, [
          ...range(sides).map(
            index =>
              [index, next(index), ['bottom']] as [
                number,
                number,
                Array<string>,
              ],
          ),
          ...range(sides).map(
            index =>
              [sides + index, sides + next(index), ['top']] as [
                number,
                number,
                Array<string>,
              ],
          ),
          ...range(sides).map(
            index =>
              [index, sides + index, ['height', 'seam']] as [
                number,
                number,
                Array<string>,
              ],
          ),
        ]),
      },
    },
  };
};

/**
 * Every face of the tapered prism fanned out around the point where its
 * corner edges would meet, with fold lines between, for card.
 */
const taperedStrip = (
  input: BuildInput,
  sides: number,
  wide: number,
  narrow: number,
  faceHeight: number,
  { wideKey, narrowKey }: { wideKey: string; narrowKey: string },
): Piece => {
  // Each face is the bottom of an isosceles triangle with its tip at the apex.
  const halfDiff = (wide - narrow) / 2;
  const outerCorner =
    Math.hypot(faceHeight, halfDiff) * (wide / (wide - narrow));
  const innerCorner = (outerCorner * narrow) / wide;
  const step = 2 * Math.asin(wide / (2 * outerCorner));
  const angles = range(sides + 1).map(
    index => -(step * sides) / 2 + index * step,
  );
  const outerRim = angles.map(angle => arc(outerCorner, angle, angle, 1)[0]);
  const innerRim = angles.map(angle => arc(innerCorner, angle, angle, 1)[0]);
  const outline: Polyline = [...outerRim, ...[...innerRim].reverse()];
  return makePiece({
    id: 'A',
    name: 'Faces',
    cut: 1,
    outline,
    edges: [
      ...range(sides).flatMap(index => [
        { keys: [wideKey], points: [outerRim[index], outerRim[index + 1]] },
        { keys: [narrowKey], points: [innerRim[index], innerRim[index + 1]] },
      ]),
      { keys: ['height', 'seam'], points: [innerRim[0], outerRim[0]] },
      {
        keys: ['height', 'seam'],
        points: [outerRim[sides], innerRim[sides]],
      },
    ],
    folds: range(sides - 1).map(index => [
      innerRim[index + 1],
      outerRim[index + 1],
    ]),
    notches: range(sides).map(index =>
      notch(outerRim[index], outerRim[index + 1], 0.5, outline),
    ),
    tabs: [sides],
    seamMm: input.seamMm,
  });
};
