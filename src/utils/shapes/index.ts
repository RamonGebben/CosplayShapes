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
  /** What it makes and what to measure, shown above the settings. */
  intro: string;
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
    intro:
      'A straight tube from one rectangle: wrap it round and close the seam. Use it for arm bands, cuffs, belt loops and pipes. Measure around the arm or form it goes on, and how tall it should be.',
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
    intro:
      'A tube cut off at a slant, so one side stands taller than the other. Use it for boot tops, slanted cuffs and pipes that meet a surface at an angle. Measure around, then the short and the tall side.',
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
    intro:
      'A tube that bends, built from wedge-shaped sections like a lobster-back pipe. Use it for steampunk pipes, hoses, ducts and elbow joints. Set how far it bends and how wide the turn is; more sections make a smoother bend.',
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
    intro:
      'A horn that tapers to a point and curls as it goes, built from wedge-shaped sections. Use it for demon horns, ram horns and tusks. Measure around the base and the tip, the length along the curl, and how far it turns.',
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
    intro:
      'A cone unrolls into one fan-shaped piece with a single seam. Use it for horns, spikes, claws and hat tips. Measure around the base and straight up to the tip; the arc and seam length are worked out for you.',
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
    intro:
      "A cone with the tip cut off, wider at one end than the other. It's the shape behind most bracers, gauntlet cuffs and greaves: measure around the narrow end and the wide end, and the height between them.",
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
    intro:
      'A rounded cap built from gores, the long pointed panels that meet at the top. Use it for helmet crowns, pauldrons and shield bosses. Measure around the head or form and how high the dome should rise.',
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
    intro:
      'A dome with a taller, egg-shaped profile: a low one rolls over smoothly, a tall one turns into an egg. Built from gores, for shield bosses, egg-shaped helmets and rounded knee and elbow cops.',
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
    intro:
      'A dome whose gores meet in a point instead of a rounded top, like a gothic arch. Use it for pointed helmets, spires and turret roofs. Measure around the base and up to the point.',
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
    intro:
      'A full ball built from gores that meet at both poles. Use it for orbs, staff tops, lanterns and round props. All it needs is the circumference you want.',
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
    intro:
      'A tube with a rounded cap on each end, like a pill. Use it for vials, power cells, canisters and tanks. Measure around it and from end to end, caps included.',
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
    intro:
      'A box that folds up from one flat net, with or without a lid. Use it for belt pouches, ammo boxes, armour plates and props. Enter the width, depth and height and the fold lines are marked for you.',
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
    intro:
      'A pyramid on a square or rectangular base, with or without the base panel. Use it for shoulder spikes, studs and armour trim. Height goes straight up from the base, not along the sloping face.',
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
    intro:
      'A straight column with flat faces: three sides for a triangle, six for a hexagon. Use it for crystals, gems, pillars and faceted handles. Set the number of sides, the width of one face and the length.',
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
    intro:
      'A faceted column that narrows from one end to the other: a truncated cone with flat sides. Use it for faceted bracers, greaves and crystal shards. Six or eight sides read as armour; fewer look more angular.',
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
