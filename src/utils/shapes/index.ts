export type ShapeSlug =
  | 'cylinder'
  | 'angled-cylinder'
  | 'elbow'
  | 'curved-horn'
  | 'cone'
  | 'truncated-cone'
  | 'dome'
  | 'oval-dome'
  | 'pointed-dome'
  | 'sphere'
  | 'capsule'
  | 'box'
  | 'pyramid'
  | 'prism'
  | 'tapered-prism';

export type ShapeTier = 'basic' | 'complex';

export type ShapeCategory =
  'tubes' | 'domes' | 'boxes' | 'bent-tubes' | 'shaped-domes' | 'faceted';

export interface LengthField {
  kind: 'length';
  key: string;
  label: string;
  /** Example value, in mm. */
  example: number;
  /** Which edges of the pattern and the model this measurement is. */
  edge: string;
  /** Set on a measurement around a circle, which the maker can also give across. */
  diameterLabel?: string;
  /** How to take the measurement, where the label alone is ambiguous. */
  hint?: string;
}

export interface CountField {
  kind: 'count';
  key: string;
  label: string;
  example: number;
  min: number;
  max: number;
  edge: string;
  hint: string;
  /** Shown after the input, for a count of something other than pieces. */
  unit?: string;
  /** Spoken unit name, when the visible one is a symbol. */
  unitName?: string;
}

export type ShapeField = LengthField | CountField;

/** Which of a round field's two inputs, around (tape) or across (ruler). */
export type RoundMeasure = 'circumference' | 'diameter';

export interface ShapeOption {
  key: string;
  label: string;
  hint: string;
  example: boolean;
}

export interface Shape {
  slug: ShapeSlug;
  name: string;
  category: ShapeCategory;
  /** What the example measurements make, so they read as an example. */
  example: string;
  fields: Array<ShapeField>;
  options: Array<ShapeOption>;
}

const SLOPE_HINT = 'Straight up from the base, not along the slope.';

const goresField = (noun: string): CountField => ({
  kind: 'count',
  key: 'gores',
  label: 'Gores',
  example: 8,
  min: 3,
  max: 24,
  edge: 'seam',
  hint: `More gores make a rounder ${noun} with more seams.`,
});

const baseCircumference = (example: number): LengthField => ({
  kind: 'length',
  key: 'circumference',
  label: 'Base circumference',
  diameterLabel: 'Base diameter',
  example,
  edge: 'circumference',
});

const endsOption = (hint: string): ShapeOption => ({
  key: 'ends',
  label: 'Close the ends',
  hint,
  example: false,
});

export const SHAPES: Array<Shape> = [
  {
    slug: 'cylinder',
    name: 'Cylinder',
    category: 'tubes',
    example: 'Arm band',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Circumference',
        diameterLabel: 'Diameter',
        example: 280,
        edge: 'circumference',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 60,
        edge: 'height',
      },
    ],
    options: [endsOption('Adds a round cap for each end.')],
  },
  {
    slug: 'angled-cylinder',
    name: 'Angled cylinder',
    category: 'bent-tubes',
    example: 'Boot top',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Circumference',
        diameterLabel: 'Diameter',
        example: 380,
        edge: 'circumference',
      },
      {
        kind: 'length',
        key: 'short',
        label: 'Short side',
        example: 120,
        edge: 'short',
        hint: 'Height where the top is lowest. The seam goes here.',
      },
      {
        kind: 'length',
        key: 'tall',
        label: 'Tall side',
        example: 180,
        edge: 'tall',
        hint: 'Height straight across from the short side, where the top is highest.',
      },
    ],
    options: [
      endsOption(
        'Adds a round cap for the bottom and an oval one for the top.',
      ),
    ],
  },
  {
    slug: 'elbow',
    name: 'Elbow',
    category: 'bent-tubes',
    example: 'Steampunk pipe',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Circumference',
        diameterLabel: 'Diameter',
        example: 250,
        edge: 'circumference',
      },
      {
        kind: 'count',
        key: 'bend',
        label: 'Bend',
        example: 90,
        min: 10,
        max: 180,
        edge: 'bend',
        hint: '90 for a right-angle elbow, 180 to turn right back.',
        unit: '°',
        unitName: 'degrees',
      },
      {
        kind: 'length',
        key: 'radius',
        label: 'Bend radius',
        example: 120,
        edge: 'radius',
        hint: 'From the point the tube bends around to the middle of the tube.',
      },
      {
        kind: 'count',
        key: 'sections',
        label: 'Sections',
        example: 4,
        min: 2,
        max: 12,
        edge: 'joint',
        hint: 'More sections make a smoother bend with more joints.',
      },
    ],
    options: [],
  },
  {
    slug: 'curved-horn',
    name: 'Curved horn',
    category: 'bent-tubes',
    example: 'Demon horn',
    fields: [
      {
        kind: 'length',
        key: 'base',
        label: 'Base circumference',
        diameterLabel: 'Base diameter',
        example: 200,
        edge: 'base',
      },
      {
        kind: 'length',
        key: 'tip',
        label: 'Tip circumference',
        diameterLabel: 'Tip diameter',
        example: 20,
        edge: 'tip',
        hint: 'A few millimetres makes a sharp point that can still be cut.',
      },
      {
        kind: 'length',
        key: 'length',
        label: 'Length',
        example: 300,
        edge: 'length',
        hint: 'Along the middle of the curl, from base to tip.',
      },
      {
        kind: 'count',
        key: 'bend',
        label: 'Curl',
        example: 90,
        min: 10,
        max: 270,
        edge: 'bend',
        hint: 'How far the horn turns from base to tip: 90 curls it a quarter turn.',
        unit: '°',
        unitName: 'degrees',
      },
      {
        kind: 'count',
        key: 'sections',
        label: 'Sections',
        example: 6,
        min: 2,
        max: 16,
        edge: 'joint',
        hint: 'More sections make a smoother curl with more joints.',
      },
    ],
    options: [],
  },
  {
    slug: 'cone',
    name: 'Cone',
    category: 'tubes',
    example: 'Horn tip',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Base circumference',
        diameterLabel: 'Base diameter',
        example: 220,
        edge: 'circumference',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 150,
        edge: 'height',
        hint: SLOPE_HINT,
      },
    ],
    options: [endsOption('Adds a round cap for the base.')],
  },
  {
    slug: 'truncated-cone',
    name: 'Truncated cone',
    category: 'tubes',
    example: 'Bracer',
    fields: [
      {
        kind: 'length',
        key: 'top',
        label: 'Top circumference',
        diameterLabel: 'Top diameter',
        example: 260,
        edge: 'top',
      },
      {
        kind: 'length',
        key: 'bottom',
        label: 'Bottom circumference',
        diameterLabel: 'Bottom diameter',
        example: 320,
        edge: 'bottom',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 180,
        edge: 'height',
        hint: SLOPE_HINT,
      },
    ],
    options: [endsOption('Adds a round cap for each end.')],
  },
  {
    slug: 'dome',
    name: 'Dome',
    category: 'domes',
    example: 'Helmet crown',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Base circumference',
        diameterLabel: 'Base diameter',
        example: 600,
        edge: 'circumference',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 95,
        edge: 'height',
        hint: 'From the rim straight up to the top, not over the curve.',
      },
      goresField('dome'),
    ],
    options: [],
  },
  {
    slug: 'oval-dome',
    name: 'Oval dome',
    category: 'shaped-domes',
    example: 'Shield boss',
    fields: [
      baseCircumference(450),
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 45,
        edge: 'height',
        hint: 'From the rim straight up to the top. The sides always leave the rim straight up, so a low dome rolls over smoothly and a tall one is egg-shaped.',
      },
      goresField('dome'),
    ],
    options: [],
  },
  {
    slug: 'pointed-dome',
    name: 'Pointed dome',
    category: 'shaped-domes',
    example: 'Pointed helmet',
    fields: [
      baseCircumference(600),
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 160,
        edge: 'height',
        hint: 'From the rim straight up to the point: at least half the base diameter.',
      },
      goresField('dome'),
    ],
    options: [],
  },
  {
    slug: 'sphere',
    name: 'Sphere',
    category: 'domes',
    example: 'Orb',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Circumference',
        diameterLabel: 'Diameter',
        example: 400,
        edge: 'circumference',
      },
      goresField('sphere'),
    ],
    options: [],
  },
  {
    slug: 'capsule',
    name: 'Capsule',
    category: 'shaped-domes',
    example: 'Power cell',
    fields: [
      {
        kind: 'length',
        key: 'circumference',
        label: 'Circumference',
        diameterLabel: 'Diameter',
        example: 200,
        edge: 'circumference',
      },
      {
        kind: 'length',
        key: 'length',
        label: 'Length',
        example: 160,
        edge: 'length',
        hint: 'End to end, including both rounded ends.',
      },
      goresField('capsule'),
    ],
    options: [],
  },
  {
    slug: 'box',
    name: 'Box',
    category: 'boxes',
    example: 'Belt pouch',
    fields: [
      {
        kind: 'length',
        key: 'width',
        label: 'Width',
        example: 120,
        edge: 'width',
      },
      {
        kind: 'length',
        key: 'depth',
        label: 'Depth',
        example: 50,
        edge: 'depth',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 90,
        edge: 'height',
      },
    ],
    options: [
      {
        key: 'lid',
        label: 'Add a lid',
        hint: 'Leave off for an open-topped box.',
        example: true,
      },
    ],
  },
  {
    slug: 'pyramid',
    name: 'Pyramid',
    category: 'boxes',
    example: 'Shoulder spike',
    fields: [
      {
        kind: 'length',
        key: 'width',
        label: 'Base width',
        example: 80,
        edge: 'width',
      },
      {
        kind: 'length',
        key: 'depth',
        label: 'Base depth',
        example: 80,
        edge: 'depth',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 110,
        edge: 'height',
        hint: SLOPE_HINT,
      },
    ],
    options: [
      {
        key: 'base',
        label: 'Include the base',
        hint: 'Leave off when the pyramid sits on armour.',
        example: false,
      },
    ],
  },
  {
    slug: 'prism',
    name: 'Prism',
    category: 'boxes',
    example: 'Crystal',
    fields: [
      {
        kind: 'count',
        key: 'sides',
        label: 'Sides',
        example: 6,
        min: 3,
        max: 12,
        edge: 'seam',
        hint: 'Three for a triangular prism, six for a hexagonal one.',
      },
      {
        kind: 'length',
        key: 'face',
        label: 'Face width',
        example: 40,
        edge: 'face',
        hint: 'One flat side, from edge to edge.',
      },
      {
        kind: 'length',
        key: 'length',
        label: 'Length',
        example: 160,
        edge: 'length',
      },
    ],
    options: [endsOption('Adds a flat cap for each end.')],
  },
  {
    slug: 'tapered-prism',
    name: 'Tapered prism',
    category: 'faceted',
    example: 'Faceted bracer',
    fields: [
      {
        kind: 'count',
        key: 'sides',
        label: 'Sides',
        example: 8,
        min: 3,
        max: 12,
        edge: 'seam',
        hint: 'Six or eight read as faceted armour; fewer look more angular.',
      },
      {
        kind: 'length',
        key: 'top',
        label: 'Top face width',
        example: 32,
        edge: 'top',
        hint: 'One flat side at the top, from edge to edge.',
      },
      {
        kind: 'length',
        key: 'bottom',
        label: 'Bottom face width',
        example: 40,
        edge: 'bottom',
        hint: 'One flat side at the bottom, from edge to edge.',
      },
      {
        kind: 'length',
        key: 'height',
        label: 'Height',
        example: 180,
        edge: 'height',
        hint: SLOPE_HINT,
      },
    ],
    options: [endsOption('Adds a flat cap for each end.')],
  },
];

export interface Category {
  id: ShapeCategory;
  name: string;
  shapes: Array<Shape>;
}

export interface Tier {
  id: ShapeTier;
  name: string;
  /** What sets this tier apart, so a first-time maker knows where to start. */
  summary: string;
  categories: Array<Category>;
}

const categoryOf = (id: ShapeCategory, name: string): Category => ({
  id,
  name,
  shapes: SHAPES.filter(shape => shape.category === id),
});

/** Every shape, basic first, each tier split into the categories makers browse. */
export const TIERS: Array<Tier> = [
  {
    id: 'basic',
    name: 'Basic shapes',
    summary: 'Straight seams and simple curves. Start here.',
    categories: [
      categoryOf('tubes', 'Tubes and cones'),
      categoryOf('domes', 'Domes and spheres'),
      categoryOf('boxes', 'Boxes and prisms'),
    ],
  },
  {
    id: 'complex',
    name: 'Complex shapes',
    summary: 'Angled tops, bends, tapers and shaped curves.',
    categories: [
      categoryOf('bent-tubes', 'Angled and bent tubes'),
      categoryOf('shaped-domes', 'Shaped domes and capsules'),
      categoryOf('faceted', 'Faceted'),
    ],
  },
];

export const isShapeSlug = (value: string): value is ShapeSlug =>
  SHAPES.some(shape => shape.slug === value);

export const getShape = (slug: ShapeSlug) =>
  SHAPES.find(shape => shape.slug === slug) ?? SHAPES[0];

export const getExampleDims = (shape: Shape) =>
  Object.fromEntries(shape.fields.map(field => [field.key, field.example]));

export const getExampleOptions = (shape: Shape) =>
  Object.fromEntries(shape.options.map(option => [option.key, option.example]));

/** A length around a circle, which the maker can also give across. */
export type RoundField = LengthField & { diameterLabel: string };

export const isRoundField = (field: ShapeField): field is RoundField =>
  field.kind === 'length' && field.diameterLabel !== undefined;

export const hasRoundFields = (shape: Shape) => shape.fields.some(isRoundField);
